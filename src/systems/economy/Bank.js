import { Events } from '../../utils/Events.js';
import { Player } from '../../entities/player/Player.js';

/**
 * LIFE RPG - Banking System
 * Gestion des comptes en banque, des intérêts, et des prêts.
 * Contrairement au "Wallet" du Player qui est du cash sur lui, 
 * la banque est sécurisée mais peut-être taxée.
 */
class BankSystem {
    constructor() {
        this.balance = 0; // Argent déposé à la banque (Different du cash de V)
        this.activeLoan = 0; // Prêt contracté
        this.loanInterestRate = 0.05; // 5% d'intérêt journalier (Usurier corporatiste)
        this.savingsInterestRate = 0.01; // 1% journalier

        this.transactions = [];
    }

    init() {
        Events.on('time:day_passed', () => this._applyDailyInterest());
    }

    deposit(amount) {
        if (Player.money >= amount) {
            Player.removeMoney(amount);
            this.balance += amount;
            this._addHistory('Deposit', amount);
            Events.emit('economy:bank_updated', { balance: this.balance });
            return true;
        }
        return false;
    }

    withdraw(amount) {
        if (this.balance >= amount) {
            this.balance -= amount;
            Player.addMoney(amount);
            this._addHistory('Withdrawal', -amount);
            Events.emit('economy:bank_updated', { balance: this.balance });
            return true;
        }
        return false;
    }

    takeLoan(amount) {
        if (this.activeLoan > 0) {
            Events.emit('ui:show_notification', { title: "BANK", message: "Pay back existing loan first.", type: "error" });
            return false;
        }
        this.activeLoan = amount;
        this.balance += amount; // Le prêt atterrit sur le compte bancaire
        this._addHistory('Loan Approved', amount);
        Events.emit('economy:bank_updated', { balance: this.balance });
        return true;
    }

    payLoan(amount) {
        if (this.activeLoan <= 0) return false;
        const actualPayment = Math.min(amount, this.activeLoan);

        if (this.balance >= actualPayment) {
            this.balance -= actualPayment;
            this.activeLoan -= actualPayment;
            this._addHistory('Loan Payment', -actualPayment);
            Events.emit('economy:bank_updated', { balance: this.balance });

            if (this.activeLoan === 0) {
                Events.emit('ui:show_notification', { title: "BANK", message: "Loan Fully Paid.", type: "success" });
            }
            return true;
        }
        return false;
    }

    _applyDailyInterest() {
        // Intérêts d'épargne (+ d'argent)
        if (this.balance > 0) {
            const earned = Math.floor(this.balance * this.savingsInterestRate);
            this.balance += earned;
            if (earned > 0) this._addHistory('Daily Interest', earned);
        }

        // Intérêts du prêt (- d'argent)
        if (this.activeLoan > 0) {
            const fee = Math.floor(this.activeLoan * this.loanInterestRate);
            this.activeLoan += fee;
            Events.emit('ui:show_notification', { title: "BANK ALERT", message: `Loan interest applied: €$${fee}`, type: "error" });
        }

        Events.emit('economy:bank_updated', { balance: this.balance });
    }

    _addHistory(desc, amt) {
        this.transactions.unshift({
            date: new Date().toLocaleDateString(), // Mock
            desc: desc,
            amount: amt
        });
        if (this.transactions.length > 50) this.transactions.pop();
    }
}

export const Bank = new BankSystem();
