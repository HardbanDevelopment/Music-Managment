import React from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import { GeoData } from '../../types';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface GeoChartProps {
    data: GeoData[];
}

const GeoChart: React.FC<GeoChartProps> = ({ data }) => {
    const colorScale = scaleQuantile<string>()
        .domain(data.map(d => d.value))
        .range([
            "#ffedea",
            "#ffcec5",
            "#ffad9f",
            "#ff8a75",
            "#ff5533",
            "#e2492d",
            "#c53d26",
            "#a8311f",
            "#8b2518"
        ]);

    return (
        <ComposableMap projectionConfig={{ scale: 160 }} >
            <ZoomableGroup center={[0, 20]}>
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map(geo => {
                            const d = data.find(s => s.id === geo.properties.iso_a3);
                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={d ? colorScale(d.value) : '#374151'}
                                    stroke="#1F2937"
                                    style={{
                                        default: { outline: 'none' },
                                        hover: { fill: '#8B5CF6', outline: 'none' },
                                        pressed: { outline: 'none' },
                                    }}
                                />
                            );
                        })
                    }
                </Geographies>
            </ZoomableGroup>
        </ComposableMap>
    );
};

export default GeoChart;
