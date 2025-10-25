'use client'

import React, { useEffect, use, useState } from 'react'
import { db } from '../../../../../utils/dbConfig';
import { Budgets, Expenses } from '../../../../../utils/schema';
import { eq, sql, getTableColumns, desc } from "drizzle-orm";
import { useUser } from '@clerk/nextjs';
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable';
import { Button } from '../../../../../@/components/ui/button';
import EditBudget from '../_components/EditBudget';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../../../../@/components/ui/alert-dialog";
import { ArrowLeft, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function ExpensesScreen({ params }) {
    const { id } = use(params);
    const { isLoaded, isSignedIn, user } = useUser();
    const [budgetInfo, setBudgetInfo] = useState(null);
    const [expensesList, setExpensesList] = useState([]);
    const route = useRouter()
    useEffect(() => {
        if (isLoaded && user && id) {
            getBudgetInfo();
        }
    }, [isLoaded, user, id]);

    // Get Budget Information

    const getBudgetInfo = async () => {
        try {

            const result = await db.select({
                ...getTableColumns(Budgets),
                totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
                totalItem: sql`count(${Expenses.id})`.mapWith(Number)
            }).from(Budgets)
                .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
                .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
                .where(eq(Budgets.id, id))
                .groupBy(Budgets.id)

            setBudgetInfo(result[0]);
            getExpensesList();
        } catch (error) {
            console.error("Failed to fetch budget info:", error);
        }
    }

    // Get Latest Expenses

    const getExpensesList = async () => {
        const result = await db.select().from(Expenses)
            .where(eq(Expenses.budgetId, id))
            .orderBy(desc(Expenses.id));
        setExpensesList(result);
        console.log(result)
    }

    const deleteBudget = async()=>{
        const deleteExpenseResult= await db.delete(Expenses)
        .where(eq(Expenses.budgetId, id))
        .returning();

        if(deleteExpenseResult)
        {
        const result = await db.delete(Budgets)
        .where(eq(Budgets.id,id))
        .returning();
        }

        toast('Budget Deleted!');
        route.replace('/dashboard/budgets');

    }

    return (
        <div className='p-10'>
            <div className='flex gap-2 justify-between items-center'>
            <h2 className='text-2xl font-bold flex gap-2 items-center' > < ArrowLeft onClick={()=>route.back()} className='cursor-pointer' /> My Expenses  </h2>
                <div className=' flex gap-2 items-center'>
               <EditBudget budgetInfo={budgetInfo} refreshData={()=> getBudgetInfo()} />
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className='flex gap-2' variant='destructive'> <Trash /> Delete </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your Budget 
                                along with your expenses.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={()=>deleteBudget()} >Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
                {budgetInfo ? (
                    <BudgetItem budget={budgetInfo} />)
                    :
                    (<div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse '>
                    </div>)
                }
                {isLoaded && isSignedIn && (
                    <AddExpense
                        budgetId={id}
                        user={user}
                        refreshData={() => getBudgetInfo()}
                    />
                )}
            </div>
            <div className=' mt-4'>
                
                <ExpenseListTable expensesList={expensesList} refreshData={() => getBudgetInfo()} />
            </div>
        </div>
    )
}

export default ExpensesScreen