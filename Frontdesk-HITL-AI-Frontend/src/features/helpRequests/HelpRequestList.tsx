import React, { useEffect, useState } from "react";
import type { HelpRequest } from "../../types";
import { getPending, getAllRequests } from "./helpRequest.service";
import ResolveForm from "./ResolveForm";
import { useLiveKit } from "../../hooks/useLiveKit";
import { Button } from "../../components/ui/button";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  History, 
  MessageCircle, 
  User, 
  RefreshCw,
  Search,
  Filter
} from "lucide-react";
import { getStatusColor } from "../../utils/statusUtils";

const HelpRequestList: React.FC = () => {
  const [pending, setPending] = useState<HelpRequest[]>([]);
  const [history, setHistory] = useState<HelpRequest[]>([]);
  const [selected, setSelected] = useState<HelpRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { publishTTS } = useLiveKit();

  const fetchPending = async () => {
    try {
      const p = await getPending();
      setPending(p);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const all = await getAllRequests();
      setHistory(all);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshAll = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchPending(), fetchHistory()]);
    setIsRefreshing(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchPending(), fetchHistory()]);
      setIsLoading(false);
    };
    
    loadData();
    const id = setInterval(fetchPending, 10000);
    return () => clearInterval(id);
  }, []);

  const filteredHistory = history.filter(request => {
    const matchesSearch = request.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.resolvedAnswer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />;
      case "Unresolved":
        return <AlertCircle className="text-red-600 w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return <Clock className="text-yellow-600 w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <MessageCircle className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Help Requests</h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">Manage and resolve customer inquiries</p>
          </div>
        </div>
        <Button
          onClick={refreshAll}
          disabled={isRefreshing}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 sm:py-2 rounded-lg flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
        >
          <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {/* Pending Requests Section */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Pending Requests</h2>
            </div>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium w-fit">
              {pending.length} waiting
            </span>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">New requests that need your attention</p>
        </div>

        <div className="p-4 sm:p-6">
          {isLoading ? (
            <div className="text-center py-8 sm:py-12">
              <RefreshCw className="animate-spin mx-auto text-blue-600 w-8 h-8 sm:w-12 sm:h-12" />
              <p className="text-gray-600 mt-3 text-sm sm:text-base">Loading requests...</p>
            </div>
          ) : pending.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg border-2 border-dashed">
              <CheckCircle className="mx-auto text-green-500 w-12 h-12 sm:w-16 sm:h-16" />
              <p className="text-gray-600 mt-3 text-base sm:text-lg">All caught up!</p>
              <p className="text-gray-500 text-sm sm:text-base">No pending help requests at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {pending.map((request) => (
                <div
                  key={request._id}
                  className="border border-orange-200 rounded-lg p-4 sm:p-5 bg-orange-50 hover:bg-orange-100 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="break-words">
                            {request.createdAt ? new Date(request.createdAt).toLocaleString() : "Unknown date"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                          <User className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="break-words">
                            Customer: {request.customerId ? request.customerId.slice(0, 8) + "..." : "unknown"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 sm:p-4 border">
                        <p className="text-gray-800 text-base sm:text-lg font-medium break-words">
                          {request.question}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => setSelected(request)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 sm:py-2 rounded-lg flex items-center gap-2 justify-center sm:justify-start transition-colors w-full sm:w-auto"
                    >
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <History className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Request History</h2>
            </div>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium w-fit">
              {filteredHistory.length} items
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions and answers..."
                className="w-full pl-10 pr-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48 pl-10 pr-8 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm sm:text-base"
              >
                <option value="all">All Status</option>
                <option value="Resolved">Resolved</option>
                <option value="Unresolved">Unresolved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
              <Search className="mx-auto text-gray-400 w-12 h-12 sm:w-16 sm:h-16" />
              <p className="text-gray-600 mt-3 text-base sm:text-lg">No requests found</p>
              <p className="text-gray-500 text-sm sm:text-base mt-1">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria" 
                  : "No history available yet"}
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {filteredHistory.map((request) => (
                <div
                  key={request._id}
                  className="border border-gray-200 rounded-lg p-4 sm:p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                        <h3 className="font-semibold text-gray-800 text-base sm:text-lg break-words">
                          {request.question}
                        </h3>
                      </div>
                      
                      {request.resolvedAnswer && (
                        <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200 mt-2">
                          <p className="text-green-800 whitespace-pre-wrap text-sm sm:text-base break-words">
                            <strong className="text-green-900">Answer:</strong> {request.resolvedAnswer}
                          </p>
                        </div>
                      )}
                      {request.supervisorReply && (
  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200 mt-2">
    <p className="text-yellow-800 whitespace-pre-wrap text-sm sm:text-base">
      <strong>Supervisor:</strong> {request.supervisorReply}
    </p>
  </div>
)}
                    </div>
                    
                    <div className="flex items-center gap-2 sm:ml-4 sm:flex-col sm:items-end sm:gap-1 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>
                        {request.createdAt ? new Date(request.createdAt).toLocaleString() : "Unknown date"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>
                        {request.customerId ? request.customerId.slice(0, 8) + "..." : "unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Resolve Form Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto m-2">
            <ResolveForm
              request={selected}
              onCancel={() => setSelected(null)}
              onResolved={() => {
                setSelected(null);
                refreshAll();
              }}
              publishTTS={publishTTS}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpRequestList;  