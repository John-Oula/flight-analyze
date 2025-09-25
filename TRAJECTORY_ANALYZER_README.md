# Trajectory Analyzer

A specialized tool for analyzing 2D XY and Z trajectories from PX4 ULOG data with setpoints and local position information.

## Features

### Split-Screen Layout
- **Left Panel**: 2D XY trajectory visualization
- **Right Panel**: Z trajectory (altitude) visualization
- Side-by-side comparison for comprehensive analysis

### Data Sources
The analyzer processes the following ULOG topics:
- `vehicle_local_position` - Actual vehicle position and velocity
- `vehicle_local_position_setpoint` - Position setpoints

### Interactive Controls
- **File Upload**: Upload .ulg files for analysis
- **Playback Controls**: Play, pause, reset trajectory animation
- **Speed Control**: Adjust playback speed (0.5x, 1x, 2x, 5x)
- **Toggle Options**: Show/hide setpoints and velocities
- **Real-time Progress**: Track current position in trajectory

### Visualization Features
- **2D XY Plot**: Shows horizontal trajectory with X/Y coordinates
- **Z Plot**: Shows altitude changes over time
- **Setpoint Overlay**: Displays commanded vs actual positions
- **Interactive Tooltips**: Hover for detailed position information
- **Responsive Design**: Adapts to different screen sizes

## Usage

1. **Navigate** to the Trajectory Analyzer page from the main navigation
2. **Upload** a ULOG file using the "Upload ULOG" button
3. **Wait** for parsing to complete (progress shown in console)
4. **Use Controls**:
   - Click Play to animate through the trajectory
   - Adjust speed with the dropdown
   - Toggle setpoints on/off
   - Reset to start from beginning

## Data Processing

The analyzer automatically:
- Extracts position data from `vehicle_local_position` messages
- Matches setpoint data from `vehicle_local_position_setpoint` messages
- Synchronizes timestamps between actual and commanded positions
- Filters and cleans data for visualization
- Handles different ULOG message formats

## Technical Details

### Chart Library
- Uses Recharts for responsive, interactive visualizations
- ComposedChart for combining multiple data series
- Custom styling to match the dark theme

### Performance
- Data decimation for large datasets (>1000 points)
- Efficient timestamp synchronization
- Memory management for long trajectories

### Error Handling
- Validates ULOG file format
- Provides clear error messages
- Graceful fallbacks for missing data

## Troubleshooting

### No Data Displayed
- Ensure ULOG file contains `vehicle_local_position` messages
- Check that file is valid .ulg format
- Verify file isn't corrupted

### Missing Setpoints
- Setpoints are optional - trajectory will show without them
- Check if ULOG contains `vehicle_local_position_setpoint` messages
- Use browser console to see available message types

### Performance Issues
- Large files may take time to parse
- Consider using smaller time ranges for very long flights
- Browser memory usage scales with trajectory length

## Integration

The Trajectory Analyzer integrates with:
- Main navigation system
- Existing ULOG parsing API
- Dark theme styling
- Responsive layout system

Access via: `/trajectory`
