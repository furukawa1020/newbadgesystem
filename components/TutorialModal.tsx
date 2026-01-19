"use strict";

interface TutorialModalProps {
    onClose: () => void;
}

export default function TutorialModal({ onClose }: TutorialModalProps) {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 animate-fade-in p-4 font-sans">
            <div className="bg-white text-black p-6 rounded-lg max-w-sm w-full border-4 border-[#e94560] relative shadow-[0_0_50px_rgba(233,69,96,0.5)]">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 font-bold text-xl"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-black text-[#e94560] mb-6 text-center tracking-widest border-b-2 border-gray-100 pb-2">遊び方</h2>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-[#e94560] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-lg shadow-md">1</div>
                        <div>
                            <p className="font-bold text-lg">スポットへ行く</p>
                            <p className="text-gray-600 text-sm mt-1 leading-relaxed">白山手取川ジオパークのマップに表示されているスポットへ実際に足を運びましょう。</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-[#e94560] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-lg shadow-md">2</div>
                        <div>
                            <p className="font-bold text-lg">タグを探す</p>
                            <p className="text-gray-600 text-sm mt-1 leading-relaxed">現地にある「NFCタグ」または「QRコード」を見つけてください。</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-[#e94560] text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-lg shadow-md">3</div>
                        <div>
                            <p className="font-bold text-lg">スキャン＆ゲット</p>
                            <p className="text-gray-600 text-sm mt-1 leading-relaxed">スマホをかざして限定の「デジタルバッジ」をゲット！全8種類のコンプリートを目指しましょう。</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 mb-3 font-bold">さあ、冒険に出かけよう！</p>
                    <button
                        onClick={onClose}
                        className="bg-[#e94560] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#c23b50] hover:scale-105 transition-all w-full"
                    >
                        わかった！
                    </button>
                </div>
            </div>
        </div>
    );
}
