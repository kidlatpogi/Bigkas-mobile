import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polyline, Circle, Line, Text as SvgText } from 'react-native-svg';
import Typography from '../common/Typography';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';

const CHART_WIDTH = Dimensions.get('window').width - spacing.md * 4;
const CHART_HEIGHT = 180;
const PADDING = 20;

/**
 * Line chart component for daily progress visualization.
 * 
 * @param {Object} props
 * @param {Array<{label: string, value: number}>} props.data - Chart data points
 * 
 * Variables for web version:
 * - data: array of objects with {label, value} for each data point
 * - chartWidth: computed chart container width
 * - chartHeight: fixed chart area height (180)
 * - dataPoints: computed SVG coordinates for each point
 */
const ProgressChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Typography variant="bodySmall" color="textSecondary" align="center">
          No data available
        </Typography>
      </View>
    );
  }

  // Find min and max values for scaling
  const values = data.map((d) => d.value);
  const minValue = Math.min(...values) * 0.9; // Add 10% padding
  const maxValue = Math.max(...values) * 1.1;
  const valueRange = maxValue - minValue;

  // Calculate chart dimensions
  const chartWidth = CHART_WIDTH;
  const chartHeight = CHART_HEIGHT - PADDING * 2;
  const stepX = chartWidth / (data.length - 1);

  // Convert data to SVG coordinates
  const dataPoints = data.map((point, index) => {
    const x = PADDING + index * stepX;
    const y =
      PADDING +
      chartHeight -
      ((point.value - minValue) / valueRange) * chartHeight;
    return { x, y, ...point };
  });

  // Create polyline points string
  const polylinePoints = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View style={styles.container}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {/* Horizontal grid line (optional) */}
        <Line
          x1={PADDING}
          y1={CHART_HEIGHT - PADDING}
          x2={CHART_WIDTH - PADDING}
          y2={CHART_HEIGHT - PADDING}
          stroke={colors.border}
          strokeWidth="1"
        />

        {/* Line connecting points */}
        <Polyline
          points={polylinePoints}
          fill="none"
          stroke={colors.primary}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data point circles */}
        {dataPoints.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="5"
            fill={colors.primary}
          />
        ))}

        {/* X-axis labels */}
        {dataPoints.map((point, index) => (
          <SvgText
            key={`label-${index}`}
            x={point.x}
            y={CHART_HEIGHT - 5}
            fontSize="10"
            fill={colors.textSecondary}
            textAnchor="middle"
          >
            {point.label}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProgressChart;
