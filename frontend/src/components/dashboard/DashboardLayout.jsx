import ChatSidebar from "./ChatSidebar.jsx";
import ChatArea from "../dashboard/ChatArea.jsx";

const DashboardLayout = () => {
    return (
        <div className="chat-dashboard">
            <ChatSidebar />
            <ChatArea />
        </div>
    );
};

export default DashboardLayout;