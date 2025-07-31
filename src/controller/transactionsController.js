import {sql} from "../config/db.js";


//get transactions by UserId
export async function getTransactionsByUserId(req, res){
     try{
    
           const {user_id} = req.params;
           const transactions = await sql `
            SELECT * FROM transactions WHERE user_id = ${user_id} ORDER BY created_at DESC
           `;
    
           res.status(200).json(transactions);
    
        }catch(error){
            console.log("Error getting the transactions", error);
            res.status(500).json({message: "Internal server Error"});
        }
}

//create transaction
export async function createTransaction(req, res){
       // title, amount, category, user_id
    try{
       const{title, amount, category, user_id} = req.body;

       if(!title || !user_id || !category || amount === undefined){
        return res.status(400).json({message: "All fields are required"});
       }

       const transaction =  await sql `
       INSERT INTO transactions(user_id, title, amount, category)
       VALUES(${user_id}, ${title}, ${amount}, ${category})
       RETURNING *
       `;

       console.log(transaction);
       res.status(201).json(transaction[0]);


    }catch(error){
        console.log("Error creating the transaction", error);
        res.status(500).json({message: "Internal server Error"});
    }
}


//Delete transaction
export async function deleteTransaction(req, res){
     try{
            const {id} = req.params;
    
            if(isNaN(parseInt(id))){
                return res.status(400).json({message: "Invalid transaction ID"});
            }
            const result = await sql 
            `
            DELETE FROM transactions WHERE id = ${id} RETURNING *
            `;
    
            if(result.length === 0){
                return res.status(404).json({message: "Transaction not found"});
            }
    
            res.status(200).json({message: "Transaction deleted successfully!"});
    
        }catch(error){
            console.log("Error deleting the transaction", error);
            res.status(500).json({message: "Internal server error"});
        }
}

//get Summary by UserID
export async function getSummaryById(req, res){
    try{
        const {user_id} = req.params;
        const balanceResult = await sql
        `
        SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${user_id};
        `;

        const incomeResult = await sql
        `
        SELECT COALESCE(SUM(amount), 0) as income FROM transactions
        WHERE user_id = ${user_id} AND amount > 0
        `;

        const expenseResult = await sql 
        `
        SELECT COALESCE(SUM(amount), 0) as expense FROM transactions
        WHERE user_id = ${user_id} AND amount < 0
        `
        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expense: expenseResult[0].expense,
        })

    }catch(error){
        console.log("Error getting the summary of transaction", error);
        res.status(500).json({message: "Internal server error"});
    }
}