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

// South Indian Chart Layout order (indices for a 4x3 grid)
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
    'As': 'text-red-500 font-bold' // Ascendant
};

const getPlanetColor = (planet: string) => PLANET_COLORS[planet.substring(0, 2)] || 'text-foreground';


export const LagnaChart: React.FC<LagnaChartProps> = ({ chartData }) => {
    const { houses, ascendant } = chartData;

    // Create a map of sign to house data for easy lookup
    const signMap = new Map<string, HouseData>();
    houses.forEach(h => signMap.set(h.sign, h));
    
    // The standard order of signs in a South Indian chart
    const signOrder = [
        'Aries', 'Taurus', 'Gemini', 'Cancer',
        'Pisces', 'Leo',
        'Aquarius', 'Virgo',
        'Capricorn', 'Sagittarius', 'Scorpio', 'Libra'
    ];
    
    // A fixed layout for South Indian chart
    const gridLayout = [
        { sign: signOrder[0], gridArea: '1 / 1 / 2 / 2' }, { sign: signOrder[1], gridArea: '1 / 2 / 2 / 3' }, { sign: signOrder[2], gridArea: '1 / 3 / 2 / 4' }, { sign: signOrder[3], gridArea: '1 / 4 / 2 / 5' },
        { sign: signOrder[4], gridArea: '2 / 1 / 3 / 2' },                                                                                                     { sign: signOrder[5], gridArea: '2 / 4 / 3 / 5' },
        { sign: signOrder[6], gridArea: '3 / 1 / 4 / 2' },                                                                                                     { sign: signOrder[7], gridArea: '3 / 4 / 4 / 5' },
        { sign: signOrder[8], gridArea: '4 / 1 / 5 / 2' }, { sign: signOrder[9], gridArea: '4 / 2 / 5 / 3' }, { sign: signOrder[10], gridArea: '4 / 3 / 5 / 4' }, { sign: signOrder[11], gridArea: '4 / 4 / 5 / 5' }
    ];
    
    const centerBoxes = [
        { sign: 'Leo', gridArea: '2 / 2 / 3 / 3' },
        { sign: 'Virgo', gridArea: '2 / 3 / 3 / 4' },
        { sign: 'Scorpio', gridArea: '3 / 2 / 4 / 3' },
        { sign: 'Libra', gridArea: '3 / 3 / 4 / 4' },
    ];


    return (
        <div className="grid grid-cols-4 w-full max-w-sm mx-auto aspect-square bg-card text-[10px]">
           {gridLayout.map(({ sign, gridArea }) => {
                const house = signMap.get(sign);
                const isAscendant = sign === ascendant;

                return (
                    <div key={sign} style={{ gridArea }} className="relative border border-border p-1 flex flex-col items-center justify-center">
                         <span className="absolute top-1 left-1 text-muted-foreground font-medium">{RASHI_ABBR[sign]}</span>
                         {isAscendant && <span className={`absolute top-1 right-1 font-bold ${getPlanetColor('As')}`}>As</span>}
                         <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                            {house?.planets.map((planet) => (
                                <span key={planet} className={`font-semibold ${getPlanetColor(planet)}`}>
                                    {planet}
                                </span>
                            ))}
                         </div>
                    </div>
                );
            })}
             <div style={{ gridArea: '2 / 2 / 4 / 4' }} className="border border-border flex flex-col items-center justify-center bg-secondary/30">
                <h4 className="font-headline text-sm">Lagna Chart</h4>
                <p className="text-xs text-muted-foreground">(South Indian)</p>
             </div>
        </div>
    );
};
