import React from 'react'
import { DEFAULT_CURRENCY } from "@/constants/currency";


const history = [
{ "userId":"478687","fromUserId":"478687","type":"my_income","amount":0.00003,"note":"mining reward","action":"credit","txHash":"0x1a7c4f0e6d9b3a2c5e8f7d1c4b6a9e0f2d3c4b5a6e7f8d9c0b1a2c3d4e5f6a7","createdAt":"2023-10-01T12:00:00Z" },
{ "userId":"478688","fromUserId":"478687","type":"team_income","amount":0.00021,"note":"team mining bonus","action":"credit","txHash":"0x2b8d5a1f7e0c4b3d6f9e8a2d5c7b0f1e3a4d5c6b7f8e9a0d1c2b3e4f5a6d7c8","createdAt":"2023-10-01T12:01:00Z" },
{ "userId":"478689","fromUserId":"478689","type":"withdraw","amount":0.5,"note":"user withdrawal","action":"debit","txHash":"0x3c9e6b2a8f1d5c4e7a0f9b3e6d8c1a2f4b5e6c7d8a9f0b1e2c3d4f5a6b7c8d9","createdAt":"2023-10-01T12:02:00Z" },
{ "userId":"478690","fromUserId":"478688","type":"loss","amount":0.12,"note":"plan not purchased loss","action":"debit","txHash":"0x4da07c3b9a2e6d5f8b1a0c4f7e9d2b3a5c6f7d8e9b0a1c2f3d4e5a6b7c8d9e0","createdAt":"2023-10-01T12:03:00Z" },
{ "userId":"478691","fromUserId":"478691","type":"my_income","amount":0.00011,"note":"plan reward","action":"credit","txHash":"0x5eb18d4c0b3f7e6a9c2b1d5a8f0e3c4b6d7e8a9c0b1d2f3a4c5e6b7d8a9f0c1","createdAt":"2023-10-01T12:04:00Z" },
{ "userId":"478692","fromUserId":"478690","type":"team_income","amount":0.00045,"note":"referral bonus","action":"credit","txHash":"0x6fc29e5d1c4a8f7b0d3c2e6b9a1f4d5c7e8f9b0c1d2e3a4b5c6d7e8f9a0b1c2","createdAt":"2023-10-01T12:05:00Z" },
{ "userId":"478693","fromUserId":"478693","type":"withdraw","amount":1.25,"note":"withdraw request","action":"debit","txHash":"0x70d3af6e2d5b9a8c1e4d3f7c0b2a5e6d8f9c0b1d2e3a4b5c6d7e8f9a0b1c2d3","createdAt":"2023-10-01T12:06:00Z" },
{ "userId":"478694","fromUserId":"478691","type":"loss","amount":0.33,"note":"inactive plan loss","action":"debit","txHash":"0x81e4b07f3e6c0b9d2f5e4a8d1c3b6f7e9a0d1c2e3f4b5c6d7e8f9a0b1c2d3e4","createdAt":"2023-10-01T12:07:00Z" },
{ "userId":"478695","fromUserId":"478695","type":"my_income","amount":0.00009,"note":"daily mining reward","action":"credit","txHash":"0x92f5c1804f7d1c0e3a6f5b9e2d4c7a8f0b1e2d3f4a5c6b7d8e9f0a1b2c3d4e5","createdAt":"2023-10-01T12:08:00Z" },
{ "userId":"478696","fromUserId":"478694","type":"team_income","amount":0.00032,"note":"team level bonus","action":"credit","txHash":"0xa306d291508e2d1f4b7a6c0f3e5d8b9a1c2f3e4b5d6a7c8e9f0a1b2c3d4e5f6","createdAt":"2023-10-01T12:09:00Z" },

{ "userId":"478697","fromUserId":"478697","type":"withdraw","amount":0.75,"note":"withdraw","action":"debit","txHash":"0xb417e3a2619f3e2a5c8b7d1a4f6e9c0b2d3a4f5e6c7d8b9a0c1e2d3f4b5a6c7","createdAt":"2023-10-01T12:10:00Z" },
{ "userId":"478698","fromUserId":"478696","type":"loss","amount":0.05,"note":"missed bonus","action":"debit","txHash":"0xc528f4b372a04f3b6d9c8e2b5a7f0d1c3e4b5a6f7d8c9e0b1d2f3a4c5e6b7d8","createdAt":"2023-10-01T12:11:00Z" },
{ "userId":"478699","fromUserId":"478699","type":"my_income","amount":0.00017,"note":"mining reward","action":"credit","txHash":"0xd63905c483b1604c7e0d9f3c6b8a1e2d4f5a6c7e8d9b0f1c2e3a4d5f6b7c8e9","createdAt":"2023-10-01T12:12:00Z" },
{ "userId":"478700","fromUserId":"478697","type":"team_income","amount":0.00028,"note":"team bonus","action":"credit","txHash":"0xe74a16d594c2715d8f1e0a4d7c9b2f3e5a6d7c8f9e0c1a2d3f4b5e6a7c8d9f0","createdAt":"2023-10-01T12:13:00Z" },
{ "userId":"478701","fromUserId":"478701","type":"withdraw","amount":2.1,"note":"withdraw","action":"debit","txHash":"0xf85b27e6a5d3826ea02f1b5e8d0c3f4a6b7e8d9f0a1c2b3e4f5a6d7e8c9f0a1","createdAt":"2023-10-01T12:14:00Z" },
{ "userId":"478702","fromUserId":"478700","type":"loss","amount":0.18,"note":"plan inactive loss","action":"debit","txHash":"0x0a6c38f7b6e4937fb1302c6f9e1d4a5b7c8f9e0a1b2d3c4e5f6a7d8e9b0c1d2","createdAt":"2023-10-01T12:15:00Z" },
{ "userId":"478703","fromUserId":"478703","type":"my_income","amount":0.00006,"note":"mining reward","action":"credit","txHash":"0x1b7d4908c7f5a48ac2413d70af2e5b6c8d9f0a1b2c3e4d5f6a7b8c9d0e1f2a3","createdAt":"2023-10-01T12:16:00Z" },
{ "userId":"478704","fromUserId":"478702","type":"team_income","amount":0.00052,"note":"team bonus","action":"credit","txHash":"0x2c8e5a19d806b59bd3524e81b03f6c7d9e0a1b2c3d4f5e6a7b8c9d0e1f2a3b4","createdAt":"2023-10-01T12:17:00Z" },
{ "userId":"478705","fromUserId":"478705","type":"withdraw","amount":0.33,"note":"withdraw","action":"debit","txHash":"0x3d9f6b2ae917c6ace4635f92c1407d8e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5","createdAt":"2023-10-01T12:18:00Z" },
{ "userId":"478706","fromUserId":"478703","type":"loss","amount":0.41,"note":"loss","action":"debit","txHash":"0x4ea07c3bf028d7bdf57460a3d2518e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5","createdAt":"2023-10-01T12:19:00Z" },

{ "userId":"478707","fromUserId":"478707","type":"my_income","amount":0.00014,"note":"mining reward","action":"credit","txHash":"0x5fb18d4c0139e8cef68571b4e3629f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6","createdAt":"2023-10-01T12:20:00Z" },
{ "userId":"478708","fromUserId":"478705","type":"team_income","amount":0.00023,"note":"team reward","action":"credit","txHash":"0x60c29e5d124af9df079682c5f473a0b1c2d3e4f5a6b7c8d9e0a1b2c3d4e5f6a","createdAt":"2023-10-01T12:21:00Z" },
{ "userId":"478709","fromUserId":"478709","type":"withdraw","amount":0.91,"note":"withdraw","action":"debit","txHash":"0x71d3af6e235b0ae018a793d60784b1c2d3e4f5a6b7c8d9e0a1b2c3d4e5f6a7b","createdAt":"2023-10-01T12:22:00Z" },
{ "userId":"478710","fromUserId":"478708","type":"loss","amount":0.07,"note":"missed income","action":"debit","txHash":"0x82e4b07f346c1bf129b8a4e71895c2d3e4f5a6b7c8d9e0a1b2c3d4e5f6a7b8c","createdAt":"2023-10-01T12:23:00Z" },
{ "userId":"478711","fromUserId":"478711","type":"my_income","amount":0.00019,"note":"mining reward","action":"credit","txHash":"0x93f5c180457d2c023ac9b5f829a6d3e4f5a6b7c8d9e0a1b2c3d4e5f6a7b8c9d","createdAt":"2023-10-01T12:24:00Z" },
{ "userId":"478712","fromUserId":"478709","type":"team_income","amount":0.00031,"note":"team bonus","action":"credit","txHash":"0xa406d291568e3d134bdaa60a3ab7e4f5a6b7c8d9e0a1b2c3d4e5f6a7b8c9d0e","createdAt":"2023-10-01T12:25:00Z" },
{ "userId":"478713","fromUserId":"478713","type":"withdraw","amount":1.02,"note":"withdraw","action":"debit","txHash":"0xb517e3a2679f4e245cebb71b4bc8f5a6b7c8d9e0a1b2c3d4e5f6a7b8c9d0e1f","createdAt":"2023-10-01T12:26:00Z" },
{ "userId":"478714","fromUserId":"478711","type":"loss","amount":0.22,"note":"inactive plan","action":"debit","txHash":"0xc628f4b378a05f356dfcc82c5cd906b7c8d9e0a1b2c3d4e5f6a7b8c9d0e1f2a","createdAt":"2023-10-01T12:27:00Z" },
{ "userId":"478715","fromUserId":"478715","type":"my_income","amount":0.00008,"note":"mining reward","action":"credit","txHash":"0xd73905c489b1604670dd93d6ed0a17c8d9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b","createdAt":"2023-10-01T12:28:00Z" },
{ "userId":"478716","fromUserId":"478714","type":"team_income","amount":0.00027,"note":"team reward","action":"credit","txHash":"0xe84a16d59ac2715781eea4e7fe1b28d9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c","createdAt":"2023-10-01T12:29:00Z" },

{ "userId":"478717","fromUserId":"478717","type":"withdraw","amount":0.61,"note":"withdraw","action":"debit","txHash":"0xf95b27e6abd3826892ffb5f90f2c39e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d","createdAt":"2023-10-01T12:30:00Z" },
{ "userId":"478718","fromUserId":"478716","type":"loss","amount":0.13,"note":"loss","action":"debit","txHash":"0x0a6c38f7bce49379a410c60a203d4ae1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e","createdAt":"2023-10-01T12:31:00Z" },
{ "userId":"478719","fromUserId":"478719","type":"my_income","amount":0.00012,"note":"reward","action":"credit","txHash":"0x1b7d4908cdf5a48bb521d71b314e5bf2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f","createdAt":"2023-10-01T12:32:00Z" },
{ "userId":"478720","fromUserId":"478718","type":"team_income","amount":0.00049,"note":"team bonus","action":"credit","txHash":"0x2c8e5a19d406b59cc632e82c425f6c03d4e5f6a7b8c9d0e1f2a3b4c5d6e7f80","createdAt":"2023-10-01T12:33:00Z" },
{ "userId":"478721","fromUserId":"478721","type":"withdraw","amount":0.44,"note":"withdraw","action":"debit","txHash":"0x3d9f6b2ae517c6add743f93d53607d14e5f6a7b8c9d0e1f2a3b4c5d6e7f8091","createdAt":"2023-10-01T12:34:00Z" },
{ "userId":"478722","fromUserId":"478719","type":"loss","amount":0.27,"note":"loss","action":"debit","txHash":"0x4ea07c3bf628d7bee8540a4e64718e25f6a7b8c9d0e1f2a3b4c5d6e7f8091a2","createdAt":"2023-10-01T12:35:00Z" },
{ "userId":"478723","fromUserId":"478723","type":"my_income","amount":0.00005,"note":"reward","action":"credit","txHash":"0x5fb18d4c0739e8cff9651b5f75829f36a7b8c9d0e1f2a3b4c5d6e7f8091a2b3","createdAt":"2023-10-01T12:36:00Z" },
{ "userId":"478724","fromUserId":"478722","type":"team_income","amount":0.00037,"note":"team bonus","action":"credit","txHash":"0x60c29e5d184af9e00a762c708693a047b8c9d0e1f2a3b4c5d6e7f8091a2b3c4","createdAt":"2023-10-01T12:37:00Z" },
{ "userId":"478725","fromUserId":"478725","type":"withdraw","amount":0.98,"note":"withdraw","action":"debit","txHash":"0x71d3af6e295b0af11b873d8197a4b158c9d0e1f2a3b4c5d6e7f8091a2b3c4d5","createdAt":"2023-10-01T12:38:00Z" },
{ "userId":"478726","fromUserId":"478724","type":"loss","amount":0.16,"note":"loss","action":"debit","txHash":"0x82e4b07f3a6c1c022c984e92a8b5c269d0e1f2a3b4c5d6e7f8091a2b3c4d5e6","createdAt":"2023-10-01T12:39:00Z" },

{ "userId":"478727","fromUserId":"478727","type":"my_income","amount":0.00015,"note":"mining reward","action":"credit","txHash":"0x93f5c1804b7d2d133da95fa3b9c6d37ae1f2a3b4c5d6e7f8091a2b3c4d5e6f7","createdAt":"2023-10-01T12:40:00Z" },
{ "userId":"478728","fromUserId":"478726","type":"team_income","amount":0.00029,"note":"team bonus","action":"credit","txHash":"0xa406d2915c8e3e244eb06fb4cad7e48bf2a3b4c5d6e7f8091a2b3c4d5e6f708","createdAt":"2023-10-01T12:41:00Z" },
{ "userId":"478729","fromUserId":"478729","type":"withdraw","amount":0.67,"note":"withdraw","action":"debit","txHash":"0xb517e3a26d9f4f355fc180c5dbe8f59c03b4c5d6e7f8091a2b3c4d5e6f70819","createdAt":"2023-10-01T12:42:00Z" },
{ "userId":"478730","fromUserId":"478727","type":"loss","amount":0.09,"note":"loss","action":"debit","txHash":"0xc628f4b37ea0604660d291d6ecf90a6d14c5d6e7f8091a2b3c4d5e6f708192a","createdAt":"2023-10-01T12:43:00Z" },
{ "userId":"478731","fromUserId":"478731","type":"my_income","amount":0.00007,"note":"reward","action":"credit","txHash":"0xd73905c48fb1715771e3a2e7fe0a1b7e25d6e7f8091a2b3c4d5e6f708192a3b","createdAt":"2023-10-01T12:44:00Z" },
{ "userId":"478732","fromUserId":"478730","type":"team_income","amount":0.00034,"note":"team reward","action":"credit","txHash":"0xe84a16d5a0c2826882f4b3f90f1b2c8f36e7f8091a2b3c4d5e6f708192a3b4c","createdAt":"2023-10-01T12:45:00Z" },
{ "userId":"478733","fromUserId":"478733","type":"withdraw","amount":1.4,"note":"withdraw","action":"debit","txHash":"0xf95b27e6b1d393799305c40a203d4da047f8091a2b3c4d5e6f708192a3b4c5d","createdAt":"2023-10-01T12:46:00Z" },
{ "userId":"478734","fromUserId":"478731","type":"loss","amount":0.31,"note":"loss","action":"debit","txHash":"0x0a6c38f7c2e4a48aa416d51b314e5eb158091a2b3c4d5e6f708192a3b4c5d6e","createdAt":"2023-10-01T12:47:00Z" },
{ "userId":"478735","fromUserId":"478735","type":"my_income","amount":0.00013,"note":"mining reward","action":"credit","txHash":"0x1b7d4908d3f5b59bb527e62c425f6fc2691a2b3c4d5e6f708192a3b4c5d6e7f","createdAt":"2023-10-01T12:48:00Z" },
{ "userId":"478736","fromUserId":"478734","type":"team_income","amount":0.00041,"note":"team bonus","action":"credit","txHash":"0x2c8e5a19e406c6acc638f73d53607fd37a2b3c4d5e6f708192a3b4c5d6e7f80","createdAt":"2023-10-01T12:49:00Z" }
]
;
const ViewHistoryTable = () => {
    return (
        <>
            <div className="overflow-auto w-full max-h-[400px] md:max-h-[500px] rounded-lg scrollbar-hidden">
                <table className="table-fixed min-w-[600px] sm:min-w-[900px] w-full text-sm">
                    <thead className="sticky top-0 z-10 bg-green-500 text-black">
                        <tr className="bg-green-500 text-black font-bold text-center">
                            <th className="w-[70px] sm:w-[100px] px-4 py-2 border">Sn.</th>
                            <th className="w-[70px] sm:w-[100px] px-4 py-2 border">To</th>
                            <th className="w-[70px] sm:w-[100px] px-4 py-2 border">From</th>
                            <th className="w-[70px] sm:w-[100px] px-4 py-2 border">Amount</th>
                            <th className="w-[70px] sm:w-[100px] px-4 py-2 border">Income Type</th>
                            <th className="w-[70px] sm:w-[100px] px-4 py-2 border">Action</th>
                            <th className="w-[70px] sm:w-[100px] px-4 py-2 border">Note</th>
                            <th className="w-[70px] sm:w-[100px] px-4 py-2 border">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((his, index) => (
                            <tr key={index} className="text-center text-white bg-neutral-700/5 odd:bg-neutral-700/70">
                                <td className="p-4">{index+1}</td>
                                <td className="p-4">{his?.userId}</td>
                                <td className="p-4">{his?.fromUserId}</td>
                                <td className="p-4">{his?.amount}</td>
                                <td className="p-4">{his?.type}</td>
                                <td className="p-4">{his?.action}</td>
                                <td className="p-4">{his?.note}</td>
                                <td className="p-4">{his?.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ViewHistoryTable