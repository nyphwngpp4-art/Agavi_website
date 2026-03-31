import { useState } from 'react'
import Header from './Header'
import BottomNav from './BottomNav'
import Leads from '../pages/Leads'
import Activity from '../pages/Activity'
import Orders from '../pages/Orders'

const TABS = ['Leads', 'Activity', 'Orders']

export default function Layout() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="min-h-screen flex flex-col">
      <Header title={TABS[activeTab]} />
      <main className="flex-1 overflow-y-auto pb-20 pt-safe">
        <div className="tab-content" key={activeTab}>
          {activeTab === 0 && <Leads />}
          {activeTab === 1 && <Activity />}
          {activeTab === 2 && <Orders />}
        </div>
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
