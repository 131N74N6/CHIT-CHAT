import type { IChatBubble } from "../models/chat.model";
import cn from "../utils/cn";

export default function ChatBubble(props: IChatBubble) {
    // Cek apakah chat ini sedang dipilih
    const isSelected = props.selectedIds.includes(props.chat._id);

    return (
        <div 
            // Tambahkan onClick pada wrapper agar seluruh area chat bisa diklik saat mode seleksi
            onClick={() => props.isSelectMode && props.toggleSelect(props.chat._id)}
            className={cn(
                "flex flex-col gap-2 p-2 rounded-sm transition-all duration-200",
                // Styling dasar berdasarkan pemilik chat
                props.own ? "ml-[50%] bg-blue-700 text-white" : "mr-[50%] bg-gray-200 text-gray-900 w-[60%]",
                // Styling saat mode seleksi aktif
                props.isSelectMode && "cursor-pointer hover:opacity-80",
                // INDIKATOR VISUAL: Berikan border/ring tebal jika terpilih
                isSelected && "ring-4 ring-orange-500 border-2 border-orange-600 bg-orange-50 text-gray-900"
            )}
        >
            {/* Opsional: Tambahkan checkbox visual yang jelas */}
            {props.isSelectMode && (
                <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                    <input 
                        type="checkbox" 
                        checked={isSelected}
                        readOnly // Biarkan onClick wrapper yang menangani logika
                        className="w-4 h-4 accent-orange-500 cursor-pointer"
                    />
                </div>
            )}

            {props.chat.media.length > 0 ? (
                <div className="w-full h-auto min-h-12.5 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-500">
                    [Media: {props.chat.media[0].url}]
                </div>
            ) : null}
            
            <div className="wrap-break-word">{props.chat.messages}</div>
        </div>
    );
}