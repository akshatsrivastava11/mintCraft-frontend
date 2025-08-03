import { Navigation } from "./navigation"
import { Sidebar } from "./Navbar"
import ChatPart from "./chatPart"

function HomePage() {
  return (
    <div className="bg-brutalist-pattern h-[93vh]">
      <Navigation />
      <Sidebar />
      <ChatPart />
    </div>
  )
}

export default HomePage
