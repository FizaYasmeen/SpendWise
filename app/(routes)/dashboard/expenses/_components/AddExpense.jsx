

import React, { useState } from 'react'
import { Input } from '../../../../../@/components/ui/input';
import { Button } from '../../../../../@/components/ui/button';
import { db } from '../../../../../utils/dbConfig';
import { Budgets, Expenses } from '../../../../../utils/schema';
import { toast } from 'sonner';
import moment from 'moment';


function AddExpense({ budgetId, user, refreshData }) {

    const [name, setName] = useState();
    const [amount, setAmount] = useState();

    const addNewExpense = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
    console.error("User missing email — cannot add expense.");
    toast("You must be logged in to add expenses.");
    return; 
  }
        const result = await db.insert(Expenses).values({
            name:name,
            amount:parseFloat(amount),
            budgetId:budgetId,
            createdBy:moment().format('DD/MM/YYYY'),
        }).returning({ insertedId:Budgets.id });
        console.log(result);

        setAmount('');
        setName('');

        if(result)
        {
            
            toast('New Expense Added');
            refreshData();
        }
  };


    return (
        <div className='border p-5 rounded-lg'>
            <h2 className='font-bold text-lg'> Add Expense</h2>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Expense Name</h2>
                <Input placeholder="e.g. Groceries"
                value={name} 
                    onChange={(e) => setName(e.target.value)} />
            </div>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'> Amount</h2>
                <Input placeholder="e.g. ₹500" 
                value={amount}
                    onChange={(e) => setAmount(e.target.value)} />
            </div>
            <Button disabled={!(name && amount)}
                onClick={() => addNewExpense()}
                className='mt-3 w-full'> Add Expense </Button>
        </div>
    )
}

export default AddExpense