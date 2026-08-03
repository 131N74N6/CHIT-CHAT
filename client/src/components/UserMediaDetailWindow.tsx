import { MessageCircle } from "lucide-react";
import Loading from "./Loading";
import FileDetail from "./FileDetail";
import type { IUserMediaDetailWindow } from "../models/chat.model";

export default function UserMediaDetailWindow(props: IUserMediaDetailWindow) {
    return (
        <div className="h-full flex-col md:flex md:flex-col hidden border border-gray-400 inset-shadow-sm inset-shadow-gray-400 overflow-y-auto">
            <div className="flex px-2.5 pt-2.5">
                <button
                    className="cursor-pointer disabled:cursor-not-allowed font-medium text-gray-700 hover:text-gray-500 transition-colors"
                    disabled={props.isUserChatProcessing}
                    onClick={props.seeChat}
                    type="button"
                >
                    <MessageCircle size={22}/>
                </button>
            </div>
            {props.userChatMedia.isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <Loading/>
                </div>
            ) : props.userChatMedia.error ? (
                <div className="flex justify-center items-center h-full">
                    <div className="text-gray-700 text-2xl font-medium text-center">{props.userChatMedia.error.message}</div>
                </div>
            ) : (
                <FileDetail files={props.userChatMedia.data} is_processing={props.userChatMedia.isLoading}/>
            )}
        </div>
    );
}