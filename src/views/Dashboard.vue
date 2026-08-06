<template>
  <DashboardLayout>
    <!-- <div class="flex justify-end mb-4">
      <button
        @click="openModal"
        class="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md"
      >
        Change Rate
      </button>
    </div> -->
   <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
    <Card>
      <p class="text-gray-500">Total Revenue</p>
      <p class="text-2xl font-bold">RM {{ totalRevenue.toFixed(2) }}</p>
    </Card>
    <Card v-if="userRole === 'Admin' || userRole === 'GoHijauOwner'">
      <p class="text-gray-500">Total Customers Balance</p>
      <p class="text-2xl font-bold">
        RM {{ (Math.round(totalCustomerPointsAwarded * 100) / 100).toFixed(2) }}
      </p>
    </Card>
    <Card>
      <p class="text-gray-500">Active Machines</p>
      <p class="text-2xl font-bold">{{ activeMachines }}</p>
    </Card>
    <Card>
      <p class="text-gray-500">Total UCO (KG)</p>
      <p class="text-2xl font-bold">{{ totalUCO }}</p>
    </Card>
    <Card v-if="userRole === 'Admin' || userRole === 'GoHijauOwner'">
      <p class="text-gray-500">Total Machine Owner Balance</p>
      <p class="text-2xl font-bold">{{ totalAllMachineOwnersEwalletBalance }}</p>
    </Card>
  </div>
      <div style="padding-top:10px ;">
        <SustainabilityChart  />
      </div>

      <!-- Collapsible Calculation Info Section -->
      <Card class="mt-4" style="background: linear-gradient(to bottom right, #f9fafb, #ffffff);">
        <button
          @click="showCalculationInfo = !showCalculationInfo"
          class="w-full flex justify-between items-center text-left group"
        >
          <span class="flex items-center gap-3">
            <div class="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
              <svg class="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                Methodology & Calculations
              </h3>
              <p class="text-xs text-gray-500 mt-0.5">
                Understand how sustainability metrics are computed
              </p>
            </div>
          </span>
          <svg
            class="w-5 h-5 text-gray-400 transform transition-all duration-300 group-hover:text-green-600"
            :class="{ 'rotate-180': showCalculationInfo }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          v-if="showCalculationInfo"
          class="mt-6 space-y-6 border-t border-gray-200 pt-6"
        >
          <!-- Overview Section -->
          <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div class="flex items-start gap-3 mb-3">
              <div class="bg-blue-50 p-2 rounded-lg">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-gray-900 mb-2">Calculation Overview</h3>
                <p class="text-sm text-gray-600 leading-relaxed">
                  Our sustainability metrics are calculated based on the amount of <strong>Used Cooking Oil (UCO)</strong> collected and recycled.
                  UCO recycling significantly reduces carbon emissions compared to virgin oil production and fossil fuel use, contributing to a circular economy and environmental sustainability.
                </p>
              </div>
            </div>
          </div>

          <!-- View Modes Explanation -->
          <div class="border border-purple-200 rounded-xl p-5" style="background: linear-gradient(to right, #faf5ff, #fdf2f8);">
            <div class="flex items-start gap-3">
              <div class="bg-purple-100 p-2 rounded-lg">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-base font-bold text-gray-900 mb-2">Chart View Modes</h3>
                <div class="space-y-2 text-sm text-gray-700">
                  <div class="flex items-start gap-2">
                    <span class="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5"></span>
                    <p><strong class="text-gray-900">Show Overall:</strong> Displays radial gauges showing total Carbon Credits and overall ESG Impact scores</p>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5"></span>
                    <p><strong class="text-gray-900">Show Breakdown:</strong> Displays pie charts breaking down Carbon Credits by impact category (Manufacturing, Recycling, Energy, Transport) and ESG scores by pillar (Environmental, Social, Governance)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Carbon Credits Calculation -->
          <div class="border border-green-200 rounded-xl p-5" style="background: linear-gradient(to bottom right, #f0fdf4, #ecfdf5);">
            <div class="flex items-start gap-3 mb-4">
              <div class="bg-green-100 p-2 rounded-lg">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-base font-bold text-gray-900">Carbon Credits Calculation</h3>
            </div>

            <div class="space-y-4">
              <div>
                <p class="text-xs font-semibold text-green-800 uppercase tracking-wide mb-2">Formula</p>
                <div class="bg-white border border-green-200 rounded-lg p-3 font-mono text-xs text-gray-800 overflow-x-auto">
                  <div class="whitespace-nowrap">
                    Carbon Credits (tCO₂e) = Oil Recycled (tonnes) × Heat Content × Carbon Content × CO₂ Conversion × Efficiency Factor
                  </div>
                </div>
              </div>

              <div>
                <p class="text-xs font-semibold text-green-800 uppercase tracking-wide mb-2">Constants Used</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="bg-white rounded-lg p-3 border border-green-200">
                    <p class="text-xs font-semibold text-gray-900">Heat Content</p>
                    <p class="text-sm text-gray-600 mt-1">42 GJ/tonne</p>
                    <p class="text-xs text-gray-500 mt-1">Average energy content of used oil</p>
                  </div>
                  <div class="bg-white rounded-lg p-3 border border-green-200">
                    <p class="text-xs font-semibold text-gray-900">Carbon Content</p>
                    <p class="text-sm text-gray-600 mt-1">20 kg C / GJ</p>
                    <p class="text-xs text-gray-500 mt-1">Carbon content of oil</p>
                  </div>
                  <div class="bg-white rounded-lg p-3 border border-green-200">
                    <p class="text-xs font-semibold text-gray-900">CO₂ Conversion</p>
                    <p class="text-sm text-gray-600 mt-1">3.67 (44/12)</p>
                    <p class="text-xs text-gray-500 mt-1">Molecular weight ratio: CO₂/C</p>
                  </div>
                  <div class="bg-white rounded-lg p-3 border border-green-200">
                    <p class="text-xs font-semibold text-gray-900">Efficiency Factor</p>
                    <p class="text-sm text-gray-600 mt-1">0.65 (65%)</p>
                    <p class="text-xs text-gray-500 mt-1">Emissions reduction from recycling</p>
                  </div>
                </div>
              </div>

              <div class="bg-green-100 border border-green-300 rounded-lg p-3">
                <p class="text-sm font-semibold text-green-900">
                  ✓ Result: <span class="text-green-700">1 Carbon Credit = 1 tonne CO₂e avoided</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Carbon Breakdown -->
          <div class="border border-blue-200 rounded-xl p-5" style="background: linear-gradient(to bottom right, #eff6ff, #ecfeff);">
            <div class="flex items-start gap-3 mb-4">
              <div class="bg-blue-100 p-2 rounded-lg">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 class="text-base font-bold text-gray-900">Carbon Credit Breakdown</h3>
            </div>

            <p class="text-sm text-gray-600 mb-4">
              The total carbon credits are distributed across four impact categories based on lifecycle assessment:
            </p>

            <div class="space-y-3">
              <div class="bg-white border-l-4 border-green-500 rounded-lg p-3">
                <div class="flex justify-between items-start mb-1">
                  <p class="text-sm font-semibold text-gray-900">Virgin Oil Production Avoided</p>
                  <span class="text-sm font-bold text-green-600">40%</span>
                </div>
                <p class="text-xs text-gray-600">Emissions saved by not producing new oil from palm/soybean crops</p>
              </div>

              <div class="bg-white border-l-4 border-emerald-400 rounded-lg p-3">
                <div class="flex justify-between items-start mb-1">
                  <p class="text-sm font-semibold text-gray-900">Recycling Process</p>
                  <span class="text-sm font-bold text-emerald-600">30%</span>
                </div>
                <p class="text-xs text-gray-600">Efficient processing with lower energy consumption</p>
              </div>

              <div class="bg-white border-l-4 border-teal-400 rounded-lg p-3">
                <div class="flex justify-between items-start mb-1">
                  <p class="text-sm font-semibold text-gray-900">Energy Offset - Biofuel Use</p>
                  <span class="text-sm font-bold text-teal-600">20%</span>
                </div>
                <p class="text-xs text-gray-600">Renewable energy generated from UCO biodiesel</p>
              </div>

              <div class="bg-white border-l-4 border-cyan-400 rounded-lg p-3">
                <div class="flex justify-between items-start mb-1">
                  <p class="text-sm font-semibold text-gray-900">Transport Optimization</p>
                  <span class="text-sm font-bold text-cyan-600">10%</span>
                </div>
                <p class="text-xs text-gray-600">Efficient collection routes reducing fuel consumption</p>
              </div>
            </div>
          </div>

          <!-- ESG Score -->
          <div class="border border-purple-200 rounded-xl p-5" style="background: linear-gradient(to bottom right, #faf5ff, #eef2ff);">
            <div class="flex items-start gap-3 mb-4">
              <div class="bg-purple-100 p-2 rounded-lg">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-base font-bold text-gray-900">ESG Impact Score</h3>
            </div>

            <p class="text-sm text-gray-600 mb-4">
              <strong>Methodology:</strong> Weighted scoring system based on three sustainability pillars
            </p>

            <div class="space-y-3 mb-4">
              <div class="bg-white rounded-lg p-3 border border-purple-200">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p class="text-sm font-semibold text-gray-900">Environmental</p>
                  </div>
                  <span class="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">60% weight</span>
                </div>
                <p class="text-xs text-gray-600">Based on CO₂e reduction vs. 1000 tonne target</p>
              </div>

              <div class="bg-white rounded-lg p-3 border border-purple-200">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-sky-400 rounded-full"></div>
                    <p class="text-sm font-semibold text-gray-900">Social</p>
                  </div>
                  <span class="text-xs font-bold text-sky-600 bg-sky-100 px-2 py-1 rounded">25% weight</span>
                </div>
                <p class="text-xs text-gray-600">Proportional to environmental score (0.5× multiplier)</p>
              </div>

              <div class="bg-white rounded-lg p-3 border border-purple-200">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-indigo-300 rounded-full"></div>
                    <p class="text-sm font-semibold text-gray-900">Governance</p>
                  </div>
                  <span class="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">15% weight</span>
                </div>
                <p class="text-xs text-gray-600">Proportional to environmental score (0.3× multiplier)</p>
              </div>
            </div>

            <div>
              <p class="text-xs font-semibold text-purple-800 uppercase tracking-wide mb-2">Formula</p>
              <div class="bg-white border border-purple-200 rounded-lg p-3 font-mono text-xs text-gray-800">
                ESG Score = (Environmental × 0.6) + (Social × 0.25) + (Governance × 0.15)
              </div>
            </div>
          </div>

          <!-- Conversion Rate -->
          <div class="border border-amber-200 rounded-xl p-5" style="background: linear-gradient(to bottom right, #fffbeb, #fefce8);">
            <div class="flex items-start gap-3 mb-3">
              <div class="bg-amber-100 p-2 rounded-lg">
                <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h3 class="text-base font-bold text-gray-900">Oil Conversion</h3>
            </div>

            <div class="bg-white border border-amber-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs text-gray-500 mb-1">Conversion Rate</p>
                  <p class="text-lg font-bold text-gray-900">1 tonne ≈ 1,136 litres</p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-500 mb-1">UCO Density</p>
                  <p class="text-sm font-semibold text-gray-700">~0.88 kg/L</p>
                </div>
              </div>
              <p class="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200">
                This conversion factor is used to transform volume measurements (litres) into mass measurements (tonnes) for accurate carbon calculations.
              </p>
            </div>
          </div>

          <!-- Sources & References -->
          <div class="bg-white border border-gray-200 rounded-xl p-5">
            <div class="flex items-start gap-3 mb-4">
              <div class="bg-gray-100 p-2 rounded-lg">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-base font-bold text-gray-900 mb-3">Sources & Standards</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="flex items-start gap-2">
                    <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <div>
                      <p class="text-xs font-semibold text-gray-900">IPCC Guidelines</p>
                      <p class="text-xs text-gray-600">Greenhouse gas inventories</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2">
                    <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <div>
                      <p class="text-xs font-semibold text-gray-900">ISO 14040/14044</p>
                      <p class="text-xs text-gray-600">LCA standards</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2">
                    <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <div>
                      <p class="text-xs font-semibold text-gray-900">EPA & EEA</p>
                      <p class="text-xs text-gray-600">Emission factors</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2">
                    <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <div>
                      <p class="text-xs font-semibold text-gray-900">GRI & SASB</p>
                      <p class="text-xs text-gray-600">ESG framework</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Note -->
          <div class="rounded-xl p-5 text-white" style="background: linear-gradient(to right, #1f2937, #374151);">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-sm font-semibold mb-2">Important Note</p>
                <p class="text-xs text-gray-200 leading-relaxed">
                  These calculations provide estimates based on industry-standard methodologies.
                  Actual carbon savings may vary based on specific processes, transportation distances, and regional energy mixes.
                  Regular updates are made to align with the latest sustainability frameworks and best practices.
                </p>
              </div>
            </div>
          </div>
        </div>
        </Card>

      <!-- <div style="padding-top:10px ;">
         <FinancialChart/>
      </div> -->
   <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 class="text-lg font-semibold mb-4">Change Rate</h2>

        <div class="space-y-4">
          <!-- Collector Buying Price -->
          <div>
            <label class="block text-gray-600 mb-1">Collector Buying Price (RM)</label>
            <input
              type="text"
              v-model="collectorPrice"
              @input="formatDecimal('collectorPrice')"
              placeholder="e.g. 3.50"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <!-- Customer Selling Price -->
          <div>
            <label class="block text-gray-600 mb-1">Customer Selling Price (RM)</label>
            <input
              type="text"
              v-model="customerPrice"
              @input="formatDecimal('customerPrice')"
              placeholder="e.g. 5.20"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showModal = false"
            class="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="saveRate"
            class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DashboardLayout from '@/layouts/dashboard_template.vue';
import Card from '@/components/Card.vue';
import FinancialChart from "@/components/FinancialChart.vue";
import SustainabilityChart from "@/components/SustainabilityChart.vue";
import api from '@/lib/apiClient'
import {getProfile} from '@/services/auth'
import { useUserStore } from '@/stores/userStore'

// Dashboard Analytics Data
const totalRevenue = ref(0);
const activeMachines = ref(0);
const totalUCO = ref(0);
const totalCustomerPointsAwarded = ref(0);
const totalAllMachineOwnersEwalletBalance = ref(0);
const userStore = useUserStore()
const userRole = userStore.user?.userRole;

const showModal = ref(false);
const collectorPrice = ref("");
const customerPrice = ref("");
const showCalculationInfo = ref(false);

// Fetch Dashboard Analytics
const fetchDashboardAnalytics = async () => {
  try {
    const { data } = await api.get('/api/dashboardanalytics/dashboard-info');
    if (data) {
      console.log("✅ Fetched dashboard analytics:", data);
      totalRevenue.value = data.totalRevenue || 0;
      activeMachines.value = data.activeMachines || 0;
      totalUCO.value = data.totalUCO || 0;
      totalCustomerPointsAwarded.value = data.totalCustomersPointsAwarded || 0;
      totalAllMachineOwnersEwalletBalance.value = data.totalAllMachineOwnersEwalletBalance || 0;
    }
  } catch (err) {
    console.error("❌ Failed to fetch dashboard analytics:", err);
    // Keep default values of 0
  }
};
const openModal = async () => {
  try {
    const { data } = await api.get('/api/rate/latest');
    if (data) {
      console.log("✅ Fetched latest rate:", data);
      collectorPrice.value = data.collectorBuyingRate?.toFixed(2) || "";
      customerPrice.value = data.customerSellingRate?.toFixed(2) || "";
    }
  } catch (err) {
    console.error("❌ Failed to fetch latest rate:", err);
  } finally {
    showModal.value = true;
  }
};
// restrict input to 2 decimal places and valid decimal pattern
const formatDecimal = (field) => {
  const value = field === "collectorPrice" ? collectorPrice : customerPrice;
  value.value = value.value
    .replace(/[^0-9.]/g, "") // remove non-numeric/non-dot chars
    .replace(/^(\d*\.?\d{0,2}).*$/, "$1"); // allow max two decimals
};

// Fetch dashboard data on component mount
onMounted(() => {
  fetchDashboardAnalytics();
});

// save data (simulate RM insertion)
const saveRate = async () => {
  try {
    const buy = parseFloat(collectorPrice.value || 0);
    const sell = parseFloat(customerPrice.value || 0);
     const profile = await getProfile()
    const payload = {
      UserId : profile.id,
      CollectorBuyingRate: buy,
      CustomerSellingRate: sell,
      CreatedAt: new Date().toISOString()
    };

    await api.post('/api/rate/add', payload);
    console.log("✅ Rate successfully saved:", payload);
  } catch (err) {
    console.error("❌ Failed to save rate:", err);
  } finally {
    showModal.value = false;
  }
};
</script>
