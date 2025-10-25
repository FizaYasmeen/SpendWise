'use client'
import React, {useState, useEffect} from 'react';
import { useUser } from '@clerk/nextjs'
import { db } from '../../../../utils/dbConfig';
import { eq, desc, sql } from "drizzle-orm";
import { Budgets, Expenses } from '../../../../utils/schema';
import ExpenseListTable from '../expenses/_components/ExpenseListTable'
import { getTableColumns } from 'drizzle-orm';


function page() {

   const{user}=useUser();
     
       const [budgetList,setBudgetList]=useState([]);
       const [expensesList,setExpensesList] = useState([]);
 
       useEffect(()=>{
         user&&getBudgetList();
       },[user]
       )
     
 
     const getBudgetList=async()=>{
       const result=await db.select({
         ...getTableColumns(Budgets),
         totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
         totalItem: sql`count(${Expenses.id})`.mapWith(Number)
       }).from(Budgets)
       .leftJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
       .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
       .groupBy(Budgets.id)
       .orderBy(desc(Budgets.id));
     
       setBudgetList(result);
       getAllExpenses();
 
 
   }
   /*
   * Used to get All Expenses 
   */
 
   const getAllExpenses=async()=>{
     const result=await db.select({
       id:Expenses.id,
       name:Expenses.name,
       amount:Expenses.amount,
       createdBy:Expenses.createdBy
     }).from(Budgets)
     .rightJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
     .where(eq(Budgets.createdBy,user?.primaryEmailAddress.emailAddress))
     .orderBy(desc(Expenses.id))
     setExpensesList(result);
    
   }

  return (

    <div>
       <ExpenseListTable expensesList={expensesList} 
        refreshData={()=>getBudgetList} />
      </div>
  )
}

export default page