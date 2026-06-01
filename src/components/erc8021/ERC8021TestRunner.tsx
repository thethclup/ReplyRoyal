'use client';

import React, { useState } from 'react';
import { generateERC8021Suffix } from '../../lib/erc8021/utils.ts';
import { validateERC8021 } from '../../lib/erc8021/validation.ts';
import { ERC8021Config } from '../../lib/erc8021/types.ts';

export function ERC8021TestRunner() {
  const [config, setConfig] = useState<ERC8021Config>({
    schema: 0,
    attributionCode: '[ATTRIBUTION_CODE]',
    builderCode: '[BUILDER_CODE]'
  });
  
  const [testResult, setTestResult] = useState<{ suffix: string, validation: any } | null>(null);

  const runTest = () => {
    try {
      const suffix = generateERC8021Suffix(config);
      const validation = validateERC8021(suffix, config, 'Strict');
      
      setTestResult({
        suffix,
        validation
      });
    } catch (err: any) {
      setTestResult({
        suffix: 'Error occurred generating suffix',
        validation: { valid: false, errors: [err.message] }
      });
    }
  };

  return (
    <div className="p-6 border border-zinc-200 rounded-lg max-w-md mx-auto my-8 bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-zinc-900">ERC-8021 Suffix Generation Validation test</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Schema</label>
          <select 
            className="w-full p-2 border rounded text-sm"
            value={config.schema}
            onChange={e => setConfig({...config, schema: Number(e.target.value) as 0|1|2})}
          >
            <option value={0}>Schema 0</option>
            <option value={1}>Schema 1</option>
            <option value={2}>Schema 2</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Attribution Code</label>
          <input 
            className="w-full p-2 border rounded text-sm font-mono"
            value={config.attributionCode}
            onChange={e => setConfig({...config, attributionCode: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Builder Code</label>
          <input 
            className="w-full p-2 border rounded text-sm font-mono"
            value={config.builderCode}
            onChange={e => setConfig({...config, builderCode: e.target.value})}
          />
        </div>

        <button 
          onClick={runTest}
          className="w-full py-2 bg-zinc-900 text-white rounded font-medium text-sm hover:bg-zinc-800"
        >
          Generate & Validate
        </button>
      </div>

      {testResult && (
        <div className="p-4 bg-zinc-50 border rounded-md font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all relative">
          <div className="font-bold text-zinc-400 mb-2">// Generated Suffix</div>
          <div className="mb-4 text-orange-600">{testResult.suffix}</div>
          
          <div className="font-bold text-zinc-400 mb-2">// Validation Results (Strict level)</div>
          <div className={testResult.validation.valid ? 'text-green-600' : 'text-red-500'}>
            Status: {testResult.validation.valid ? 'Valid ✅' : 'Invalid ❌'}
          </div>
          {!testResult.validation.valid && (
            <ul className="mt-2 text-red-500 list-disc pl-4 space-y-1">
              {testResult.validation.errors.map((err: string, i: number) => <li key={i}>{err}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
