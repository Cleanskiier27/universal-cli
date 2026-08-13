import React from 'react';
import { ShoppingCart, Package, Shield, Globe, Cpu, Zap } from 'lucide-react';

const Marketplace = () => {
    const items = [
        { id: 'sbir-payout', name: 'NASA SBIR Payout Package', description: 'Final documentation and technical deliverables for M2M milestones.', price: '$50,000,000', icon: <Package className="text-[#ffb400]" />, status: 'AVAILABLE' },
        { id: 'neural-sync', name: 'Preciseliens Neural Sync', description: 'Bi-directional telemetry cycles for multi-agent synchronization.', price: '2.5 ETH', icon: <Brain className="text-[#9d50bb]" />, status: 'ACTIVE' },
        { id: 'network-boost', name: 'NetworkBuster Suite V2', description: 'Advanced network path optimization and real-time monitoring.', price: '$9,999', icon: <Zap className="text-[#00f0ff]" />, status: 'READY' },
        { id: 'artemis-nav', name: 'Artemis Navigation Data', description: 'High-precision star tracking and trajectory data from NASA/ESA.', price: 'CONTRACT ONLY', icon: <Globe className="text-[#00ff9d]" />, status: 'RESTRICTED' },
        { id: 'cloud-storage-100', name: '100GB Reserved Cloud Storage', description: 'Encrypted LRS storage expansion for neural datasets and backups.', price: '$3.88/mo', icon: <Shield className="text-[#00ff9d]" />, status: 'AVAILABLE' }
    ];

    const marketPulse = [
        { label: 'QNT', value: '8.92%', tone: '#00ff9d' },
        { label: 'AAPL', value: '+3.41%', tone: '#00f0ff' },
        { label: 'NVDA', value: '+6.17%', tone: '#9d50bb' },
        { label: 'BTC', value: '+4.66%', tone: '#ffd166' },
        { label: 'ETH', value: '+2.11%', tone: '#7ae6ff' }
    ];

    const megastructure = [
        { label: 'Capital Flow', value: '$2.8T', level: '92%' },
        { label: 'Liquidity', value: '$1.1T', level: '74%' },
        { label: 'Velocity', value: '3.7x', level: '88%' }
    ];

    const candlesticks = [
        { open: 48, close: 52, low: 46, high: 56 },
        { open: 52, close: 50, low: 48, high: 54 },
        { open: 50, close: 59, low: 49, high: 62 },
        { open: 59, close: 57, low: 53, high: 60 },
        { open: 57, close: 63, low: 55, high: 65 },
        { open: 63, close: 61, low: 58, high: 66 }
    ];

    const volumeBars = [32, 58, 72, 46, 81, 66, 93, 54, 70, 83];

    const riskMap = [
        ['low', 'low', 'med', 'med'],
        ['low', 'med', 'high', 'med'],
        ['med', 'high', 'high', 'critical'],
        ['med', 'med', 'high', 'low']
    ];

    const tickerTape = ['QNT ▲ 8.92%', 'AAPL ▲ 3.41%', 'NVDA ▲ 6.17%', 'BTC ▲ 4.66%', 'ETH ▲ 2.11%', 'AMD ▲ 2.88%', 'MSFT ▲ 1.54%', 'GOOG ▲ 2.40%'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '18px', color: '#eaf3ff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <div>
                    <div style={{ color: '#00f0ff', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>Wealth Megastructure</div>
                    <h2 style={{ margin: 0, fontSize: 30, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Market Streaming</h2>
                </div>
                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', color: '#fff' }}>
                    <ShoppingCart className="text-[#00f0ff]" size={18} />
                    <span style={{ fontSize: 12, letterSpacing: '0.12em' }}>CREDITS: ∞</span>
                </div>
            </div>

            <div style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '8px 0', background: 'rgba(0,240,255,0.04)' }}>
                <div style={{ display: 'flex', gap: 14, whiteSpace: 'nowrap', animation: 'ticker-scroll 16s linear infinite', width: 'max-content' }}>
                    {[...tickerTape, ...tickerTape].map((tick, index) => (
                        <span key={`${tick}-${index}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 8px', border: '1px solid rgba(0,240,255,0.2)', color: '#dfe9f7', fontSize: 11, letterSpacing: '0.08em' }}>
                            <span style={{ color: '#00ff9d' }}>{tick}</span>
                        </span>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
                <div className="glass-panel" style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div style={{ color: '#00f0ff', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Capital lattice</div>
                        <div style={{ color: '#00ff9d', fontSize: 11, letterSpacing: '0.14em' }}>LIVE</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
                        {megastructure.map((field) => (
                            <div key={field.label} style={{ border: '1px solid rgba(0,240,255,0.18)', background: 'rgba(0,240,255,0.03)', padding: 12 }}>
                                <div style={{ color: '#7c91b2', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>{field.label}</div>
                                <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{field.value}</div>
                                <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                                    <div style={{ position: 'absolute', inset: 0, width: field.level, background: 'linear-gradient(90deg, #00f0ff, #00ff9d)', boxShadow: '0 0 12px rgba(0,240,255,0.45)' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: 16 }}>
                    <div style={{ color: '#00f0ff', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12 }}>Risk heatmap</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
                        {riskMap.flat().map((risk, index) => (
                            <div key={`${risk}-${index}`} style={{ height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.05)', background: risk === 'low' ? 'rgba(0,255,157,0.12)' : risk === 'med' ? 'rgba(255,209,102,0.12)' : risk === 'high' ? 'rgba(255,120,90,0.14)' : 'rgba(255,76,82,0.18)', color: risk === 'low' ? '#00ff9d' : risk === 'med' ? '#ffd166' : risk === 'high' ? '#ff9f6e' : '#ff6b6b' }}>{risk}</div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 12 }}>
                <div className="glass-panel" style={{ padding: 16 }}>
                    <div style={{ color: '#00f0ff', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12 }}>Candlestick panel</div>
                    <div style={{ display: 'flex', alignItems: 'end', gap: 8, height: 110, paddingTop: 8 }}>
                        {candlesticks.map((candle, index) => {
                            const bodyHeight = Math.max(18, Math.abs(candle.close - candle.open) * 6);
                            const top = 90 - Math.max(candle.open, candle.close) * 1.2;
                            const wickTop = 90 - candle.high * 1.2;
                            const wickHeight = Math.max(10, Math.abs(candle.high - candle.low) * 1.2);
                            return (
                                <div key={`${candle.open}-${index}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                    <div style={{ position: 'relative', width: 18, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ position: 'absolute', left: '50%', width: 2, height: wickHeight, transform: 'translateX(-50%)', background: candle.close >= candle.open ? '#00ff9d' : '#ff6b6b', top: wickTop }} />
                                        <div style={{ position: 'absolute', left: '50%', width: 12, height: bodyHeight, transform: 'translateX(-50%)', background: candle.close >= candle.open ? 'linear-gradient(180deg, rgba(0,255,157,0.95), rgba(0,240,255,0.65))' : 'linear-gradient(180deg, rgba(255,107,107,0.95), rgba(255,160,122,0.65))', top: top, boxShadow: candle.close >= candle.open ? '0 0 12px rgba(0,255,157,0.5)' : '0 0 12px rgba(255,107,107,0.45)' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: 16 }}>
                    <div style={{ color: '#00f0ff', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 12 }}>Volume bars</div>
                    <div style={{ display: 'flex', alignItems: 'end', gap: 8, height: 110 }}>
                        {volumeBars.map((value, index) => (
                            <div key={`${value}-${index}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'end', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: '100%', height: `${value}%`, minHeight: 16, background: 'linear-gradient(180deg, rgba(0,240,255,0.9), rgba(0,255,157,0.7))', boxShadow: '0 0 10px rgba(0,240,255,0.45)' }} />
                                <span style={{ color: '#7c91b2', fontSize: 8 }}>{index + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, flex: 1, overflow: 'hidden' }}>
                {items.map((item) => (
                    <div key={item.id} className="glass-panel" style={{ padding: 14, borderColor: 'rgba(0,240,255,0.18)', background: 'rgba(6, 15, 22, 0.75)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>{item.icon || <Cpu />}</div>
                            <span style={{ fontSize: 9, letterSpacing: '0.12em', border: '1px solid rgba(0,240,255,0.3)', color: item.status === 'RESTRICTED' ? '#ff6b6b' : '#00ff9d', padding: '3px 6px' }}>{item.status}</span>
                        </div>
                        <h3 style={{ margin: 0, marginBottom: 8, fontSize: 15, fontWeight: 700 }}>{item.name}</h3>
                        <p style={{ margin: 0, marginBottom: 12, color: '#8fa7c9', fontSize: 11, lineHeight: 1.6 }}>{item.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#00f0ff', fontWeight: 700, fontSize: 13 }}>{item.price}</span>
                            <button style={{ border: '1px solid rgba(0,240,255,0.4)', background: 'rgba(0,240,255,0.08)', color: '#00f0ff', padding: '6px 10px', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>Deploy</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Brain = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 5.886 4 4 0 0 0 5.137 1.247L12 21l2.863-2.972a4 4 0 0 0 5.137-1.247 4 4 0 0 0 .52-5.886 4 4 0 0 0-2.526-5.77A3 3 0 1 0 12 5z" />
        <path d="M9 13a4.5 4.5 0 0 0 3-4" />
        <path d="M15 13a4.5 4.5 0 0 1-3-4" />
        <path d="M12 9v4" />
    </svg>
);

export default Marketplace;
