import React from 'react';

type HouseData = {
    house: number;
    sign: string;
    planets: string[];
};

type ChartData = {
    ascendant: string;
    houses: HouseData[];
};

interface LagnaChartProps {
    chartData: ChartData;
}

// South Indian Chart Layout order
const southIndianLayout = [1, 2, 3, 4, 12, 0, 0, 5, 11, 10, 9, 8];

const RASHI_ABBR: { [key: string]: string } = {
    'Aries': 'Ar', 'Taurus': 'Ta', 'Gemini': 'Ge', 'Cancer': 'Cn',
    'Leo': 'Le', 'Virgo': 'Vi', 'Libra': 'Li', 'Scorpio': 'Sc',
    'Sagittarius': 'Sg', 'Capricorn': 'Cp', 'Aquarius': 'Aq', 'Pisces': 'Pi'
};

const PLANET_COLORS: { [key: string]: string } = {
    'SU': 'text-red-600',
    'MO': 'text-yellow-400',
    'MA': 'text-red-500',
    'ME': 'text-green-500',
    'JU': 'text-yellow-600',
    'VE': 'text-pink-400',
    'SA': 'text-blue-500',
    'RA': 'text-gray-500',
    'KE': 'text-gray-400',
};

const getPlanetColor = (planet: string) => PLANET_COLORS[planet] || 'text-foreground';

export const LagnaChart: React.FC<LagnaChartProps> = ({ chartData }) => {
    const { houses } = chartData;

    // Create a map for quick lookup of house data
    const houseMap = new Map<number, HouseData>();
    houses.forEach(h => houseMap.set(h.house, h));

    const renderCell = (houseNumber: number, isLagna: boolean) => {
        const house = houseMap.get(houseNumber);
        if (!house) return <div key={`empty-${houseNumber}`} className="border border-border"></div>;

        return (
            <div key={houseNumber} className="relative border border-border p-1 flex flex-col justify-between h-24">
                <div className="text-xs text-muted-foreground">{RASHI_ABBR[house.sign]}</div>
                <div className="flex-grow flex flex-wrap items-center justify-center gap-1">
                    {isLagna && <span className="absolute top-1 right-1 text-red-500 font-bold text-xs">As</span>}
                    {house.planets.map((planet, index) => (
                        <span key={index} className={`font-bold text-xs ${getPlanetColor(planet)}`}>
                            {planet}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    const lagnaHouse = houses.find(h => h.sign === chartData.ascendant);
    const lagnaHouseNumber = lagnaHouse ? lagnaHouse.house : 1;

    // We need to rotate the signs based on the ascendant
    const signOrder = Object.keys(RASHI_ABBR);
    const ascendantSignIndex = signOrder.indexOf(chartData.ascendant);

    const chartHouses = Array.from({ length: 12 }, (_, i) => {
        const currentSignIndex = (ascendantSignIndex + i) % 12;
        const currentSign = signOrder[currentSignIndex];
        const houseDataForSign = houses.find(h => h.sign === currentSign);
        return {
            house: i + 1,
            sign: currentSign,
            planets: houseDataForSign ? houseDataForSign.planets : []
        };
    });

    const houseMapForChart = new Map<number, HouseData>();
    chartHouses.forEach(h => houseMapForChart.set(h.house, h));


    return (
        <div className="grid grid-cols-4 grid-rows-3 w-full max-w-sm mx-auto aspect-square bg-card">
            {southIndianLayout.map((pos, index) => {
                if (pos === 0) {
                     // Center Lagna Box
                    return (
                        <div key={`center-${index}`} className="col-span-2 row-span-1 border border-border flex flex-col items-center justify-center bg-secondary/30">
                           <h4 className="font-headline text-sm">Lagna Chart</h4>
                           <p className="text-xs text-muted-foreground">{chartData.ascendant}</p>
                        </div>
                    );
                }
                return renderCell(pos, pos === 1);
            })}
        </div>
    );
};
