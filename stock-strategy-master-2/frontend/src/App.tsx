import React, { useState, useEffect } from 'react';
import { Settings, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data structure matching the image columns
const mockData = [
  {
    sNo: "1",
    three: "3",
    two: "2",
    one: "1",
    ivCurrent: "25.3",
    ivIncreaseDecrease: "28.75",
    fromStraddleSelling: "-3",
    changeFromStraddle: "-10.17",
    straddleSellerLTP: "24.75",
    straddleBuyerLTP: "25.50",
    straddleDifference: "0.75",
    straddleDiffLotSize: "37.5",
    straddleRangeFromLTP: "±50",
    straddleLotSize: "2500",
    lotSize: "50",
    straddleOrderPlace: "Yes",
    sector: "Index",
    news: "Bullish",
    symbol: "NIFTY",
    ltp: "24750",
    changePercent: "+0.51%",
    netChange: "+125.50",
    avgDailyMovement: "1.2%",
    pcr: "0.85",
    intradayTrend: "Bullish",
    trend: "Uptrend",
    deliveryData: "68.5%",
    resistance: "25000, 25200, 25500",
    support: "24500, 24200, 24000",
    cePremium: "₹150 (0.6%)",
    ceDistance: "250 pts",
    marginPerLot: "₹75,000",
    premiumAgainstMargin: "0.2%",
    pePremium: "₹125 (0.5%)",
    peDistance: "250 pts",
  }
];

const nseIndices = [
  { name: "NIFTY 50", value: "24,750.30", change: "+125.50", percent: "+0.51%" },
  { name: "NIFTY BANK", value: "51,234.75", change: "-89.25", percent: "-0.17%" },
  { name: "NIFTY IT", value: "43,892.10", change: "+256.80", percent: "+0.59%" },
  { name: "NIFTY AUTO", value: "23,456.90", change: "+123.45", percent: "+0.53%" },
  { name: "NIFTY PHARMA", value: "19,876.45", change: "-45.60", percent: "-0.23%" },
  { name: "NIFTY FMCG", value: "67,543.20", change: "+234.10", percent: "+0.35%" },
  { name: "NIFTY METAL", value: "8,765.43", change: "-56.78", percent: "-0.64%" },
  { name: "NIFTY ENERGY", value: "34,567.89", change: "+145.67", percent: "+0.42%" },
];

const defaultColumns = {
  sNo: true,
  three: true,
  two: true,
  one: true,
  ivCurrent: true,
  ivIncreaseDecrease: true,
  fromStraddleSelling: true,
  changeFromStraddle: true,
  straddleSellerLTP: true,
  straddleBuyerLTP: true,
  straddleDifference: true,
  straddleDiffLotSize: true,
  straddleRangeFromLTP: true,
  straddleLotSize: true,
  lotSize: true,
  straddleOrderPlace: true,
  sector: true,
  news: true,
  symbol: true,
  ltp: true,
  changePercent: true,
  netChange: true,
  avgDailyMovement: true,
  pcr: true,
  intradayTrend: true,
  trend: true,
  deliveryData: true,
  resistance: true,
  support: true,
  cePremium: true,
  ceDistance: true,
  marginPerLot: true,
  premiumAgainstMargin: true,
  pePremium: true,
  peDistance: true,
};

const columnHeaders = {
  sNo: "S.No",
  three: "3",
  two: "2",
  one: "1",
  ivCurrent: "IV-Current",
  ivIncreaseDecrease: "IV (Increase/Decrease since last day in %)",
  fromStraddleSelling: "+- (From Straddle Selling LTP)",
  changeFromStraddle: "% Change (From Straddle Selling LTP)",
  straddleSellerLTP: "Straddle Seller LTP",
  straddleBuyerLTP: "Straddle Buyer LTP",
  straddleDifference: "Straddle Difference (Buyer-Seller)",
  straddleDiffLotSize: "Straddle Difference * Lot Size",
  straddleRangeFromLTP: "Straddle Range from LTP",
  straddleLotSize: "Straddle * Lot Size",
  lotSize: "Lot Size",
  straddleOrderPlace: "Straddle Order Place",
  sector: "Sector (Can See Stock Sector wise - Need Filter)",
  news: "News",
  symbol: "Symbol",
  ltp: "LTP",
  changePercent: "% Change",
  netChange: "Net Change",
  avgDailyMovement: "Avg Daily Stock Movement in % (Show in Different Font/Colour)",
  pcr: "PCR (Trend wise - Chart)",
  intradayTrend: "Intraday Trend",
  trend: "Trend",
  deliveryData: "Delhivery Data (Last 30 days - Can Short Date wise)",
  resistance: "Resistance (Show Highest 3 Strike OI & Volume)",
  support: "Support (Show Highest 3 Strike OI & Volume)",
  cePremium: "CE Premium (will put Value in Rupee & in %)",
  ceDistance: "CE Distance",
  marginPerLot: "Margin per Lot",
  premiumAgainstMargin: "Premium Against Margin",
  pePremium: "PE Premium (will put Value in Rupee & in %)",
  peDistance: "PE Distance",
};

function App() {
  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [columnOrder, setColumnOrder] = useState(Object.keys(defaultColumns));
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    Object.keys(defaultColumns).reduce((acc, key) => ({ ...acc, [key]: 80 }), {})
  );
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);
  const [popupPosition, setPopupPosition] = useState({ x: 100, y: 100 });
  const [isDraggingPopup, setIsDraggingPopup] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const moveColumn = (fromIndex: number, toIndex: number) => {
    const newOrder = [...columnOrder];
    const [movedColumn] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedColumn);
    setColumnOrder(newOrder);
  };

  const handleDragStart = (e: React.DragEvent, column: string) => {
    setDraggedColumn(column);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault();
    if (draggedColumn && draggedColumn !== targetColumn) {
      const fromIndex = columnOrder.indexOf(draggedColumn);
      const toIndex = columnOrder.indexOf(targetColumn);
      moveColumn(fromIndex, toIndex);
    }
    setDraggedColumn(null);
  };

  const handleResizeStart = (e: React.MouseEvent, column: string) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingColumn(column);
    setResizeStartX(e.clientX);
    setResizeStartWidth(columnWidths[column]);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (resizingColumn) {
      const diff = e.clientX - resizeStartX;
      const newWidth = Math.max(60, resizeStartWidth + diff);
      setColumnWidths(prev => ({
        ...prev,
        [resizingColumn]: newWidth
      }));
    }
  };

  const handleResizeEnd = () => {
    setResizingColumn(null);
  };

  const handlePopupMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.popup-header')) {
      setIsDraggingPopup(true);
      setDragStart({
        x: e.clientX - popupPosition.x,
        y: e.clientY - popupPosition.y
      });
    }
  };

  const handlePopupMouseMove = (e: MouseEvent) => {
    if (isDraggingPopup) {
      setPopupPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handlePopupMouseUp = () => {
    setIsDraggingPopup(false);
  };

  useEffect(() => {
    if (resizingColumn) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizingColumn, resizeStartX, resizeStartWidth]);

  useEffect(() => {
    if (isDraggingPopup) {
      document.addEventListener('mousemove', handlePopupMouseMove);
      document.addEventListener('mouseup', handlePopupMouseUp);
      return () => {
        document.removeEventListener('mousemove', handlePopupMouseMove);
        document.removeEventListener('mouseup', handlePopupMouseUp);
      };
    }
  }, [isDraggingPopup, dragStart]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-white">Trading Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* NSE Indices Ticker */}
      <div className="bg-blue-800 text-white py-2 overflow-hidden">
        <div className="animate-scroll whitespace-nowrap">
          <div className="inline-flex items-center gap-8">
            <span className="font-semibold text-sm">ALL SECTOR WISE % & NET CHANGE (FREQ ON TOP ROW) Including India Vix-NO OF ADVANCE/DECLINE</span>
            {nseIndices.map((index, i) => (
              <div key={i} className="inline-flex items-center gap-2">
                <span className="font-medium text-sm">{index.name}:</span>
                <span className="text-sm">{index.value}</span>
                <span className={`text-sm font-medium ${index.change.startsWith('+') ? 'text-green-300' : 'text-red-300'}`}>
                  {index.change} ({index.percent})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Title */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <h2 className="text-xl font-bold text-center text-white">DASHBOARD</h2>
      </div>

      {/* Column Settings Popup */}
      {showColumnSettings && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setShowColumnSettings(false)}
          />
          
          {/* Draggable Popup */}
          <div 
            className="fixed bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 min-w-[800px] max-w-[90vw] max-h-[80vh]"
            style={{ 
              left: `${popupPosition.x}px`, 
              top: `${popupPosition.y}px`,
              transform: 'translate(0, 0)'
            }}
            onMouseDown={handlePopupMouseDown}
          >
            {/* Popup Header */}
            <div className="popup-header bg-gray-700 px-4 py-3 rounded-t-lg cursor-move flex items-center justify-between border-b border-gray-600">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Column Settings
              </h2>
              <button
                onClick={() => setShowColumnSettings(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded"
              >
                ✕
              </button>
            </div>
            
            {/* Popup Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-60px)]">
              <div className="flex gap-6">
                {/* Column Visibility */}
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white mb-3">Column Visibility</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                    {columnOrder.map((key) => (
                      <label key={key} className="flex items-center gap-2 text-xs cursor-pointer p-2 hover:bg-gray-700 rounded">
                        <input
                          type="checkbox"
                          checked={visibleColumns[key as keyof typeof visibleColumns]}
                          onChange={() => toggleColumn(key)}
                          className="w-3 h-3"
                        />
                        <span className="text-gray-300 text-xs leading-tight" title={columnHeaders[key as keyof typeof columnHeaders]}>
                          {columnHeaders[key as keyof typeof columnHeaders]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Column Order */}
                <div className="w-96">
                  <h3 className="text-sm font-semibold text-white mb-3">Column Order</h3>
                  <div className="space-y-1 max-h-96 overflow-y-auto">
                    {columnOrder.map((key, index) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 p-2 bg-gray-700 rounded text-xs hover:bg-gray-600 transition-colors"
                      >
                        <GripVertical className="w-3 h-3 text-gray-400" />
                        <span className="flex-1 text-gray-200 text-xs">
                          {index + 1}. {columnHeaders[key as keyof typeof columnHeaders]}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => index > 0 && moveColumn(index, index - 1)}
                            disabled={index === 0}
                            className="p-1 hover:bg-gray-500 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => index < columnOrder.length - 1 && moveColumn(index, index + 1)}
                            disabled={index === columnOrder.length - 1}
                            className="p-1 hover:bg-gray-500 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Table */}
      <div className="flex-1">
        <div className="overflow-auto h-[calc(100vh-200px)]">
          <table className="text-xs" style={{ minWidth: 'max-content' }}>
            <thead className="bg-gray-700 sticky top-0">
              <tr>
                {columnOrder.map((key) => (
                  visibleColumns[key as keyof typeof visibleColumns] && (
                    <th 
                      key={key} 
                      className="px-1 py-3 text-left font-semibold text-white border-r border-gray-600 bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 transition-all duration-200 relative group"
                      style={{ width: `${columnWidths[key]}px`, minWidth: '80px' }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, key)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, key)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="truncate text-xs leading-tight text-blue-200 font-bold tracking-wide uppercase flex-1" title={columnHeaders[key as keyof typeof columnHeaders]}>
                          {columnHeaders[key as keyof typeof columnHeaders]}
                        </div>
                        <GripVertical className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-move ml-1" />
                      </div>
                      {/* Resize Handle */}
                      <div
                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors"
                        onMouseDown={(e) => handleResizeStart(e, key)}
                      />
                    </th>
                  )
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-800">
              {mockData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-700 border-b border-gray-700">
                  {columnOrder.map((key) => (
                    visibleColumns[key as keyof typeof visibleColumns] && (
                      <td 
                        key={key} 
                        className="px-1 py-2 text-gray-100 border-r border-gray-700"
                        style={{ width: `${columnWidths[key]}px`, minWidth: '80px' }}>
                        <div className={`truncate ${
                          (key === 'changePercent' || key === 'netChange') ? 
                            (row[key as keyof typeof row].toString().startsWith('+') ? 'text-green-400' : 
                             row[key as keyof typeof row].toString().startsWith('-') ? 'text-red-400' : '') : ''
                        }`}>
                          {row[key as keyof typeof row]}
                        </div>
                      </td>
                    )
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resize cursor overlay */}
      {resizingColumn && (
        <div className="fixed inset-0 cursor-col-resize z-50" style={{ pointerEvents: 'none' }} />
      )}

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default App;