interface AlertIntrf {
    message: string;
}

export default function Alert(props: AlertIntrf) {
    return (
        <div className="fixed inset-0 z-20 top-6 left-0.5 w-full">
            <div className="bg-red-400 flex justify-center items-center w-[50%] border-gray-400 border rounded-lg p-4 shadow-2xl">
                <div className="font-medium text-white text-xl text-center">{props.message}</div>
            </div>
        </div>
    );
}