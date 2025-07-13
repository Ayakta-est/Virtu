import ChatAssistant from "../../components/chat/ChatAssistant";

export default function EmployeeAssistantPage() {
  return (
    <div className="max-w-2xl mx-auto h-[80vh] pt-6">
      <h1 className="text-xl font-semibold mb-4">Habla con nosotros</h1>
      <ChatAssistant />
    </div>
  );
}
