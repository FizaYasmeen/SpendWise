'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import CardInfo from '../dashboard/_components/CardInfo'
import BarChartDashboard from '../dashboard/_components/BarChartDashboard';
import { db } from '../../../utils/dbConfig';
import { getTableColumns } from 'drizzle-orm';
import { eq, sql, desc } from "drizzle-orm";
import BudgetItem from '../dashboard/budgets/_components/BudgetItem';
import { Budgets, Expenses } from '../../../utils/schema';
import ExpenseListTable from '../dashboard/expenses/_components/ExpenseListTable';

function Dashboard() {

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
    <div className='p-8'>
      <h2 className='font-bold text-3xl'> Hi! {user?.fullName}✌️ </h2>
      <p className='text-gray-500'> Control the chaos - Own your money. Let's manage your expenses </p>
    <CardInfo budgetList={budgetList} />
    <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-3'>
      <div className='md:col-span-2'>
        <BarChartDashboard budgetList={budgetList} />
        
        <ExpenseListTable expensesList={expensesList} 
        refreshData={()=>getBudgetList} />

      </div>
      <div className='grid gap-2'>
        <h2 className='font-bold text-lg'> Latest Budgets</h2>
        {budgetList.map((budget,index)=>(
          <BudgetItem budget={budget} key={index} />
        ))}
      </div>
    </div>
    
    </div>
  )
}

export default Dashboard