import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, BarChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Bar } from 'recharts';
import Title from './Title';
import { Typography } from '@mui/material';


export default function Chart(props) {
  const theme = useTheme();
  console.log(props.data)
  return (
    <React.Fragment>
      {/* <Typography>{props.title}</Typography> */}
      <ResponsiveContainer>
        <BarChart
          data={props.data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <Bar dataKey="amount" fill="#1565c0"/>
          <XAxis
            dataKey="date"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Duration (mins)
            </Label>
          </YAxis>
          {/* <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          /> */}
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
