'use client'

import React from 'react'

export default function DashboardPage() {
  return (
    <div className="h-full w-full bg-dark-bg p-4">
      {/* Grid Layout */}
      <div className="grid grid-cols-3 gap-4 h-full">
        
        {/* Container 1 - Target Orbits */}
        <div className="bg-dark-surface border border-dark-border p-3">
          <div className="mb-2">
            <h3 className="text-dark-text text-sm font-semibold">TARGET ORBITS</h3>
            <p className="text-dark-text-secondary text-xs">Orbital parameters and intercept calculations</p>
          </div>
        </div>

        {/* Container 2 - Flight Panel */}
        <div className="bg-dark-surface border border-dark-border p-3">
          <div className="mb-2">
            <h3 className="text-dark-text text-sm font-semibold">FLIGHT PANEL</h3>
            <p className="text-dark-text-secondary text-xs">Altitude, velocity and flight status indicators</p>
          </div>
        </div>

        {/* Container 3 - Engine Checks */}
        <div className="bg-dark-surface border border-dark-border p-3">
          <div className="mb-2">
            <h3 className="text-dark-text text-sm font-semibold">ENGINE CHECKS</h3>
            <p className="text-dark-text-secondary text-xs">Propulsion system diagnostics and status</p>
          </div>
        </div>

        {/* Container 4 - L Panel */}
        <div className="bg-dark-surface border border-dark-border p-3">
          <div className="mb-2">
            <h3 className="text-dark-text text-sm font-semibold">L - PANEL</h3>
            <p className="text-dark-text-secondary text-xs">System performance and load distribution</p>
          </div>
        </div>

        {/* Container 5 - Pressure Panel */}
        <div className="bg-dark-surface border border-dark-border p-3">
          <div className="mb-2">
            <h3 className="text-dark-text text-sm font-semibold">PRESSURE PANEL</h3>
            <p className="text-dark-text-secondary text-xs">Fluid pressure monitoring and control</p>
          </div>
        </div>

        {/* Container 6 - Fuel Tanks */}
        <div className="bg-dark-surface border border-dark-border p-3">
          <div className="mb-2">
            <h3 className="text-dark-text text-sm font-semibold">FUEL TANKS</h3>
            <p className="text-dark-text-secondary text-xs">Propellant levels and consumption tracking</p>
          </div>
        </div>

        {/* Container 7 - Warnings */}
        <div className="bg-dark-surface border border-dark-border p-3">
          <div className="mb-2">
            <h3 className="text-dark-text text-sm font-semibold">WARNINGS</h3>
            <p className="text-dark-text-secondary text-xs">System alerts and fault detection</p>
          </div>
        </div>

        {/* Container 8 - Navigation Status */}
        <div className="bg-dark-surface border border-dark-border p-3">
          <div className="mb-2">
            <h3 className="text-dark-text text-sm font-semibold">NAVIGATION STATUS</h3>
            <p className="text-dark-text-secondary text-xs">GPS, IMU and positioning systems</p>
          </div>
        </div>

        {/* Container 9 - Communication */}
        <div className="bg-dark-surface border border-dark-border p-3">
          <div className="mb-2">
            <h3 className="text-dark-text text-sm font-semibold">COMMUNICATION</h3>
            <p className="text-dark-text-secondary text-xs">Telemetry and ground station links</p>
          </div>
        </div>

      </div>
    </div>
  )
} 