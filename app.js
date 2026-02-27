/**
 * 基金智投Pro - 智能投资助手
 * 核心JavaScript功能 (修复版)
 */

// ==================== 数据管理 ====================
const FundData = {
    // 模拟基金数据
    allFunds: [
        { code: '161039', name: '富国中证新能源汽车指数A', type: 'index', netValue: 1.5247, estimatedValue: 1.5382,
          dayChange: 2.35, weekChange: 5.82, monthReturn: 8.52, yearReturn: 25.63,
          scale: 156.8, managementFee: 1.00, custodialFee: 0.10, holdings: 75.2, description: '跟踪新能源汽车板块' },
        { code: '110022', name: '易方达消费行业股票', type: 'stock', netValue: 3.2156, estimatedValue: 3.1987,
          dayChange: -0.52, weekChange: -1.25, monthReturn: -2.15, yearReturn: 18.92,
          scale: 320.5, managementFee: 1.50, custodialFee: 0.30, holdings: 85.6, description: '专注大消费行业龙头' },
        { code: '161725', name: '招商中证白酒指数(LOF)', type: 'index', netValue: 0.9856, estimatedValue: 0.9923,
          dayChange: 0.68, weekChange: 3.25, monthReturn: 5.23, yearReturn: 32.15,
          scale: 520.3, managementFee: 1.00, custodialFee: 0.20, holdings: 62.8, description: '聚焦高端白酒板块' },
        { code: '340001', name: '兴全可转债混合A', type: 'mix', netValue: 1.8567, estimatedValue: 1.8621,
          dayChange: 0.29, weekChange: 1.58, monthReturn: 3.85, yearReturn: 12.58,
          scale: 89.2, managementFee: 1.20, custodialFee: 0.20, holdings: 92.5, description: '可转债配置为主' },
        { code: '000861', name: '汇添富中证主要消费ETF联接', type: 'index', netValue: 2.1567, estimatedValue: 2.1456,
          dayChange: -0.51, weekChange: -2.15, monthReturn: -1.25, yearReturn: 28.93,
          scale: 156.8, managementFee: 0.50, custodialFee: 0.10, holdings: 45.2, description: '消费板块指数投资' },
        { code: '003376', name: '广发中证全指信息技术ETF联接A', type: 'index', netValue: 1.4256, estimatedValue: 1.4389,
          dayChange: 0.93, weekChange: 4.25, monthReturn: 6.85, yearReturn: 35.62,
          scale: 78.5, managementFee: 0.50, custodialFee: 0.10, holdings: 88.9, description: '科技行业全覆盖' },
        { code: '001552', name: '天弘中证银行指数A', type: 'index', netValue: 1.1256, estimatedValue: 1.1189,
          dayChange: -0.60, weekChange: -3.52, monthReturn: -3.25, yearReturn: 8.92,
          scale: 45.6, managementFee: 0.60, custodialFee: 0.10, holdings: 95.2, description: '银行板块指数' },
        { code: '003984', name: '嘉实新能源新材料股票A', type: 'stock', netValue: 1.8567, estimatedValue: 1.8923,
          dayChange: 1.92, weekChange: 8.15, monthReturn: 12.35, yearReturn: 45.68,
          scale: 125.6, managementFee: 1.50, custodialFee: 0.30, holdings: 72.5, description: '新能源+新材料双轮驱动' },
        { code: '001594', name: '天弘中证500指数增强A', type: 'index', netValue: 1.6523, estimatedValue: 1.6789,
          dayChange: 1.62, weekChange: 4.85, monthReturn: 7.52, yearReturn: 22.35,
          scale: 68.5, managementFee: 1.00, custodialFee: 0.10, holdings: 82.5, description: '中盘成长增强策略' },
        { code: '110011', name: '易方达中小盘混合', type: 'mix', netValue: 2.8567, estimatedValue: 2.8125,
          dayChange: -1.52, weekChange: -3.25, monthReturn: -4.52, yearReturn: 15.68,
          scale: 185.6, managementFee: 1.50, custodialFee: 0.25, holdings: 78.5, description: '中小盘成长投资' },
        { code: '000170', name: '广发高端制造股票A', type: 'stock', netValue: 1.4523, estimatedValue: 1.4689,
          dayChange: 1.25, weekChange: 3.85, monthReturn: 5.62, yearReturn: 28.92,
          scale: 95.6, managementFee: 1.50, custodialFee: 0.30, holdings: 68.5, description: '高端制造主题投资' },
        { code: '000867', name: '华宝标普500指数(QDII)人民币A', type: 'qdii', netValue: 2.1256, estimatedValue: 2.1389,
          dayChange: 0.45, weekChange: 1.25, monthReturn: 2.85, yearReturn: 18.62,
          scale: 68.5, managementFee: 1.00, custodialFee: 0.25, holdings: 95.2, description: '投资标普500指数' }
    ],

    watchlist: [],
    portfolio: [],

    init() {
        this.loadFromStorage();
        if (this.watchlist.length === 0) {
            this.watchlist = ['161039', '110022', '161725', '340001', '003376'];
            this.saveToStorage();
        }
    },

    getFund(code) {
        return this.allFunds.find(f => f.code === code);
    },

    getWatchlistFunds() {
        return this.watchlist.map(code => this.getFund(code)).filter(f => f);
    },

    calculateDeviation(fund) {
        if (!fund.netValue || !fund.estimatedValue) return 0;
        return ((fund.estimatedValue - fund.netValue) / fund.netValue * 100).toFixed(2);
    },

    calculateEstimateChange(fund) {
        return ((fund.estimatedValue - fund.netValue) / fund.netValue * 100).toFixed(2);
    },

    saveToStorage() {
        localStorage.setItem('fundWatchlist', JSON.stringify(this.watchlist));
    },

    loadFromStorage() {
        const saved = localStorage.getItem('fundWatchlist');
        if (saved) {
            this.watchlist = JSON.parse(saved);
        }
    },

    toggleWatchlist(code) {
        const index = this.watchlist.indexOf(code);
        if (index > -1) {
            this.watchlist.splice(index, 1);
            return false;
        } else {
            this.watchlist.push(code);
            return true;
        }
    },

    calculatePortfolio() {
        let totalCost = 0;
        let totalValue = 0;

        this.portfolio = this.getWatchlistFunds().map(fund => {
            const positions = Math.floor(Math.random() * 50000) + 10000;
            const cost = positions * (fund.netValue * (0.85 + Math.random() * 0.25));
            const value = positions * fund.netValue;
            totalCost += cost;
            totalValue += value;

            return {
                ...fund,
                positions,
                cost,
                value,
                profit: value - cost,
                profitRate: ((value - cost) / cost * 100).toFixed(2)
            };
        });

        return {
            funds: this.portfolio,
            totalCost: totalCost.toFixed(2),
            totalValue: totalValue.toFixed(2),
            totalProfit: (totalValue - totalCost).toFixed(2),
            totalRate: ((totalValue - totalCost) / totalCost * 100).toFixed(2)
        };
    },

    // 搜索基金
    searchFunds(keyword) {
        if (!keyword || keyword.trim() === '') {
            return this.allFunds.slice(0, 10);
        }
        const kw = keyword.toLowerCase().trim();
        return this.allFunds.filter(f =>
            f.code.includes(kw) ||
            f.name.toLowerCase().includes(kw)
        ).slice(0, 10);
    }
};

// ==================== 仓位调整原因 ====================
const PositionReasons = {
    getReason(fund, deviation, dayChange, weekChange, monthReturn) {
        const reasons = [];

        if (deviation > 0.8) {
            reasons.push('估值高出较多，注意回调风险');
        } else if (deviation < -0.8) {
            reasons.push('估值低于实际，可能存在补涨空间');
        } else if (deviation > 0.3) {
            reasons.push('估值略高，可适当减仓');
        } else if (deviation < -0.3) {
            reasons.push('估值偏低，是加仓好时机');
        }

        if (dayChange > 2.5) {
            reasons.push('单日涨幅较大，谨慎追高');
        } else if (dayChange < -2.5) {
            reasons.push('大幅回调，可逢低加仓');
        }

        if (weekChange > 6) {
            reasons.push('周涨幅较高，建议减仓');
        } else if (weekChange < -6) {
            reasons.push('周跌幅较大，是加仓时机');
        }

        if (monthReturn > 8) {
            reasons.push('月涨幅较大，注意风险');
        } else if (monthReturn < -5) {
            reasons.push('月跌幅较大，长期看好可加仓');
        }

        if (reasons.length === 0) {
            reasons.push('基本面良好，建议继续持有');
        }

        return {
            reasons: reasons.slice(0, 2),
            fullReasons: reasons.join('；')
        };
    },

    getSuggestion(deviation, dayChange, weekChange, monthReturn) {
        let score = 0;

        if (deviation < -1) score += 3;
        else if (deviation < -0.5) score += 2;
        else if (deviation < -0.3) score += 1;
        else if (deviation > 1) score -= 3;
        else if (deviation > 0.5) score -= 2;
        else if (deviation > 0.3) score -= 1;

        if (dayChange < -2) score += 2;
        else if (dayChange > 2) score -= 2;
        else if (dayChange < -1) score += 1;
        else if (dayChange > 1) score -= 1;

        if (weekChange < -5) score += 2;
        else if (weekChange > 5) score -= 2;
        else if (weekChange < -3) score += 1;
        else if (weekChange > 3) score -= 1;

        if (monthReturn < -4) score += 1;
        else if (monthReturn > 6) score -= 1;

        let action = '持有';
        let className = 'hold';
        let actionDesc = '';

        if (score >= 3) {
            action = '强烈加仓';
            className = 'buy';
            actionDesc = '建议加仓30%-50%';
        } else if (score >= 1.5) {
            action = '适量加仓';
            className = 'buy';
            actionDesc = '建议加仓10%-20%';
        } else if (score >= 0.5) {
            action = '轻仓加仓';
            className = 'buy';
            actionDesc = '建议加仓5%-10%';
        } else if (score <= -3) {
            action = '强烈减仓';
            className = 'sell';
            actionDesc = '建议减仓30%-50%';
        } else if (score <= -1.5) {
            action = '适量减仓';
            className = 'sell';
            actionDesc = '建议减仓10%-20%';
        } else if (score <= -0.5) {
            action = '轻仓减仓';
            className = 'sell';
            actionDesc = '建议减仓5%-10%';
        } else {
            actionDesc = '保持现有仓位不变';
        }

        return { action, className, actionDesc };
    }
};

// ==================== 图表管理 ====================
const Charts = {
    pieChart: null,
    profitChart: null,

    initPieChart(data) {
        const ctx = document.getElementById('pieChart');
        if (!ctx) return;
        if (this.pieChart) this.pieChart.destroy();

        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

        this.pieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map((f, i) => `${f.name.substring(0, 4)}...`),
                datasets: [{
                    data: data.map(f => f.value ? parseFloat(f.value.toFixed(2)) : f.netValue * 10000),
                    backgroundColor: colors.slice(0, data.length),
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: { legend: { display: false } }
            }
        });
    },

    initProfitChart(period = '1M') {
        const ctx = document.getElementById('profitChart');
        if (!ctx) return;
        if (this.profitChart) this.profitChart.destroy();

        const periods = { '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365, 'ALL': 730 };
        const days = periods[period];

        const labels = [];
        const fundData = [];
        const benchmarkData = [];
        let fundValue = 10000;
        let benchmarkValue = 10000;

        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
            fundValue *= (1 + (Math.random() - 0.42) * 2.5 / 100);
            benchmarkValue *= (1 + (Math.random() - 0.45) * 2 / 100);
            fundData.push(fundValue);
            benchmarkData.push(benchmarkValue);
        }

        this.profitChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    { label: '我的组合', data: fundData, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.12)', fill: true, tension: 0.4, pointRadius: 0, borderWidth: 2.5 },
                    { label: '沪深300', data: benchmarkData, borderColor: '#94a3b8', borderDash: [6, 4], fill: false, tension: 0.4, pointRadius: 0, borderWidth: 2 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { intersect: false, mode: 'index' },
                plugins: { legend: { display: true, position: 'top', align: 'end', labels: { usePointStyle: true, padding: 16 } } },
                scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } }, y: { grid: { color: 'rgba(148, 163, 184, 0.08)' }, ticks: { callback: function(value) { return '¥' + value.toLocaleString(); } } } }
            }
        });
    }
};

// ==================== 资讯管理 ====================
const NewsData = {
    news: [
        { id: 1, title: '央行降准0.25个百分点，释放长期资金约5000亿元', source: '央视财经', time: '10分钟前', category: 'policy', hot: true },
        { id: 2, title: 'A股成交额突破1.5万亿元创年内新高', source: '证券时报', time: '30分钟前', category: 'market', hot: true },
        { id: 3, title: '公募基金规模突破31万亿元权益类基金表现亮眼', source: '中国基金报', time: '1小时前', category: 'fund', hot: true },
        { id: 4, title: '新能源汽车销量同比增长35%', source: '财新', time: '2小时前', category: 'market', hot: false },
        { id: 5, title: '证监会发布公募基金费率改革方案', source: '证监会', time: '3小时前', category: 'policy', hot: true }
    ],

    getNews(filter = 'all') {
        if (filter === 'all') return this.news;
        return this.news.filter(n => n.category === filter);
    }
};

// ==================== UI渲染 ====================
const UI = {
    renderValuationTable() {
        const tbody = document.getElementById('valuationBody');
        if (!tbody) return;

        const funds = FundData.getWatchlistFunds();
        const fundTypeMap = { stock: '股票型', bond: '债券型', mix: '混合型', index: '指数型', qdii: 'QDII' };

        tbody.innerHTML = funds.map((fund, index) => {
            const deviation = parseFloat(FundData.calculateDeviation(fund));
            const estimateChange = parseFloat(FundData.calculateEstimateChange(fund));
            const weekChange = fund.weekChange;
            const monthReturn = fund.monthReturn;

            const suggestionData = PositionReasons.getSuggestion(deviation, fund.dayChange, weekChange, monthReturn);
            const reasonsData = PositionReasons.getReason(fund, deviation, fund.dayChange, weekChange, monthReturn);
            const fee = (fund.managementFee + fund.custodialFee).toFixed(1);

            return `
                <tr class="fade-in" style="animation-delay: ${index * 0.05}s">
                    <td>
                        <div class="fund-name">
                            ${fund.name}
                            <span class="code">${fund.code} · ${fundTypeMap[fund.type]}</span>
                        </div>
                    </td>
                    <td class="valuation-cell font-bold">${fund.netValue.toFixed(4)}</td>
                    <td class="valuation-cell font-bold">${fund.estimatedValue.toFixed(4)}</td>
                    <td class="${estimateChange >= 0 ? 'positive-text' : 'negative-text'}">
                        ${estimateChange >= 0 ? '+' : ''}${estimateChange.toFixed(2)}%
                    </td>
                    <td><span class="deviation ${deviation >= 0 ? 'up' : 'down'}">${deviation >= 0 ? '↑' : '↓'}${Math.abs(deviation).toFixed(2)}%</span></td>
                    <td class="${fund.dayChange >= 0 ? 'positive-text' : 'negative-text'}">${fund.dayChange >= 0 ? '+' : ''}${fund.dayChange.toFixed(2)}%</td>
                    <td class="${weekChange >= 0 ? 'positive-text' : 'negative-text'}">${weekChange >= 0 ? '+' : ''}${weekChange.toFixed(2)}%</td>
                    <td class="${monthReturn >= 0 ? 'positive-text' : 'negative-text'}">${monthReturn >= 0 ? '+' : ''}${monthReturn.toFixed(2)}%</td>
                    <td><span class="fee-badge">${fee}%</span></td>
                    <td style="min-width: 160px; text-align: left; padding: 8px;">
                        <span class="suggestion ${suggestionData.className}" style="display: inline-block; margin-bottom: 4px; font-size: 12px;">${suggestionData.action}</span>
                        <div class="suggestion-reason" title="${reasonsData.fullReasons}" style="font-size: 11px; cursor: help;">${reasonsData.reasons[0] || '持有观望'}</div>
                        <div class="action-hint" style="font-size: 10px; margin-top: 2px;">${suggestionData.actionDesc}</div>
                    </td>
                    <td>
                        <div class="action-btns">
                            <button class="action-btn" title="详情" onclick="UI.showFundDetail('${fund.code}')"><i class="fas fa-chart-bar"></i></button>
                            <button class="action-btn delete" title="删除" onclick="UI.confirmRemove('${fund.code}', '${fund.name}')"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    renderPortfolio() {
        const portfolio = FundData.calculatePortfolio();
        document.getElementById('totalAsset').textContent = '¥' + parseInt(portfolio.totalValue).toLocaleString();
        document.getElementById('totalProfit').textContent = (parseFloat(portfolio.totalProfit) >= 0 ? '+¥' : '-¥') + Math.abs(parseFloat(portfolio.totalProfit)).toLocaleString();
        document.getElementById('totalProfit').className = 'value ' + (parseFloat(portfolio.totalProfit) >= 0 ? 'positive' : 'negative');
        document.getElementById('totalRate').textContent = (parseFloat(portfolio.totalRate) >= 0 ? '+' : '') + parseFloat(portfolio.totalRate).toFixed(2) + '%';
        document.getElementById('totalRate').className = 'value ' + (parseFloat(portfolio.totalRate) >= 0 ? 'positive' : 'negative');

        const holdingsList = document.getElementById('holdingsList');
        if (holdingsList && portfolio.funds.length > 0) {
            const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
            const totalValue = parseFloat(portfolio.totalValue);

            holdingsList.innerHTML = portfolio.funds.map((fund, i) => {
                const fundValue = fund.value || fund.netValue * fund.holdings;
                return `
                    <div class="holding-item fade-in" style="animation-delay: ${i * 0.05}s">
                        <div class="holding-color" style="background: ${colors[i % colors.length]}"></div>
                        <div class="holding-info">
                            <div class="holding-name">${fund.name.substring(0, 10)}${fund.name.length > 10 ? '...' : ''}</div>
                            <div class="holding-code">${fund.code}</div>
                        </div>
                        <div class="holding-value" style="text-align: right;">
                            <div style="font-weight: 600;">¥${parseInt(fundValue).toLocaleString()}</div>
                            <div style="font-size: 11px; opacity: 0.7;">持仓${fund.holdings.toFixed(1)}%</div>
                        </div>
                    </div>
                `;
            }).join('');

            Charts.initPieChart(portfolio.funds);
        }
    },

    renderNews(filter = 'all') {
        const newsList = document.getElementById('newsList');
        if (!newsList) return;

        const news = NewsData.getNews(filter);
        const categoryMap = { policy: '政策', market: '市场', fund: '基金' };
        const iconMap = { policy: 'fa-file-alt', market: 'fa-chart-line', fund: 'fa-university' };

        newsList.innerHTML = news.map(item => `
            <div class="news-item fade-in">
                <div class="news-thumb"><i class="fas ${iconMap[item.category]}"></i></div>
                <div class="news-content">
                    <div class="news-title">${item.title}</div>
                    <div class="news-meta">
                        <span class="tag ${item.hot ? 'hot' : ''}" style="${!item.hot ? 'background: rgba(59, 130, 246, 0.1); color: var(--primary-color);' : ''}">${item.hot ? '热门' : categoryMap[item.category]}</span>
                        <span>${item.source}</span>
                        <span>${item.time}</span>
                    </div>
                </div>
            </div>
        `).join('');
    },

    renderRecommend() {
        const recommendList = document.getElementById('recommendList');
        if (!recommendList) return;

        const sorted = [...FundData.allFunds].sort((a, b) => b.yearReturn - a.yearReturn).slice(0, 5);
        const typeMap = { stock: '股票型', bond: '债券型', mix: '混合型', index: '指数型', qdii: 'QDII' };

        recommendList.innerHTML = sorted.map((fund, index) => `
            <div class="recommend-item fade-in" style="animation-delay: ${index * 0.05}s">
                <div class="rank" style="${index < 3 ? 'background: linear-gradient(135deg, #f59e0b, #fbbf24);' : 'background: linear-gradient(135deg, #64748b, #94a3b8);'}">${index + 1}</div>
                <div class="recommend-info">
                    <div class="recommend-name">${fund.name}</div>
                    <div class="recommend-type">${fund.code} · ${typeMap[fund.type]}</div>
                </div>
                <div class="recommend-rate">
                    <div class="rate positive">+${fund.yearReturn.toFixed(2)}%</div>
                    <div class="label">近一年</div>
                </div>
            </div>
        `).join('');
    },

    renderSearchResults(funds, keyword = '') {
        const results = document.getElementById('searchResults');
        if (!results) return;

        if (!keyword) {
            // 显示全部可添加基金
            const availableFunds = FundData.allFunds.filter(f => !FundData.watchlist.includes(f.code));
            funds = availableFunds.slice(0, 10);
        }

        if (funds.length === 0) {
            results.innerHTML = '<p style="text-align: center; color: var(--text-tertiary); padding: 30px;">未找到相关基金</p>';
            return;
        }

        const typeMap = { stock: '股票型', bond: '债券型', mix: '混合型', index: '指数型', qdii: 'QDII' };

        results.innerHTML = funds.map(fund => {
            const isInWatchlist = FundData.watchlist.includes(fund.code);
            return `
                <div class="search-result-item">
                    <div class="search-result-info">
                        <div class="search-result-name">${fund.name}</div>
                        <div class="search-result-code">${fund.code} · ${typeMap[fund.type]}</div>
                    </div>
                    <button class="add-btn-mini" onclick="UI.handleAddFund('${fund.code}')">${isInWatchlist ? '已添加' : '添加'}</button>
                </div>
            `;
        }).join('');
    },

    handleAddFund(code) {
        const wasAdded = FundData.toggleWatchlist(code);
        FundData.saveToStorage();
        this.renderValuationTable();
        this.renderPortfolio();

        // 刷新搜索结果
        const searchInput = document.getElementById('modalSearch');
        const keyword = searchInput ? searchInput.value : '';
        this.renderSearchResults(FundData.searchFunds(keyword), keyword);

        this.showToast(wasAdded ? '✅ 已添加到自选' : '🗑️ 已从自选移除');
    },

    confirmRemove(code, name) {
        if (confirm(`确定要从自选移除 "${name}" 吗？`)) {
            this.removeFund(code);
        }
    },

    removeFund(code) {
        FundData.toggleWatchlist(code);
        FundData.saveToStorage();
        this.renderValuationTable();
        this.renderPortfolio();
        this.showToast('🗑️ 已从自选移除');
    },

    showFundDetail(code) {
        const fund = FundData.getFund(code);
        if (!fund) return;

        // 显示基金详情弹窗
        const modal = document.getElementById('fundDetailModal');
        if (modal) {
            document.getElementById('detailName').textContent = fund.name;
            document.getElementById('detailCode').textContent = fund.code;
            document.getElementById('detailType').textContent = { stock: '股票型', bond: '债券型', mix: '混合型', index: '指数型', qdii: 'QDII' }[fund.type];
            document.getElementById('detailDesc').textContent = fund.description || '暂无描述';
            document.getElementById('detailNetValue').textContent = fund.netValue.toFixed(4);
            document.getElementById('detailScale').textContent = fund.scale + '亿元';
            document.getElementById('detailFee').textContent = (fund.managementFee + fund.custodialFee).toFixed(1) + '%';
            modal.classList.add('show');
        } else {
            this.showToast(`${fund.name} - ${fund.description || '点击查看详情'}`);
        }
    },

    showToast(message) {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 2200);
    },

    updateTime() {
        const timeEl = document.getElementById('updateTime');
        if (timeEl) {
            timeEl.textContent = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        }
    }
};

// ==================== 初始化和事件 ====================
document.addEventListener('DOMContentLoaded', () => {
    // 初始化数据
    FundData.init();

    // 渲染界面
    UI.renderValuationTable();
    UI.renderPortfolio();
    UI.renderNews();
    UI.renderRecommend();
    UI.updateTime();

    // 初始化图表
    Charts.initProfitChart('1M');

    // 搜索框事件
    const fundSearch = document.getElementById('fundSearch');
    const searchBtn = document.getElementById('searchBtn');
    fundSearch?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') UI.showToast(`🔍 搜索: ${fundSearch.value}`);
    });
    searchBtn?.addEventListener('click', () => UI.showToast(`🔍 搜索: ${fundSearch.value}`));

    // 筛选芯片
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 添加基金弹窗
    const addFundBtn = document.getElementById('addFundBtn');
    const modal = document.getElementById('addFundModal');
    const closeModal = document.getElementById('closeModal');

    addFundBtn?.addEventListener('click', () => {
        UI.renderSearchResults([]);
        modal.classList.add('show');
    });
    closeModal?.addEventListener('click', () => modal.classList.remove('show'));
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
    });

    // 弹窗内搜索
    const modalSearch = document.getElementById('modalSearch');
    const modalSearchBtn = document.getElementById('modalSearchBtn');

    modalSearch?.addEventListener('input', function() {
        const results = FundData.searchFunds(this.value);
        UI.renderSearchResults(results, this.value);
    });
    modalSearchBtn?.addEventListener('click', () => {
        const results = FundData.searchFunds(modalSearch.value);
        UI.renderSearchResults(results, modalSearch.value);
    });

    // 图表周期
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            Charts.initProfitChart(this.dataset.period);
        });
    });

    // 资讯筛选
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            UI.renderNews(this.dataset.tab);
        });
    });

    // 底部导航
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 刷新推荐
    document.getElementById('refreshRecommend')?.addEventListener('click', () => {
        UI.renderRecommend();
        UI.showToast('🔄 已换一换');
    });

    // 刷新数据
    document.getElementById('refreshData')?.addEventListener('click', () => {
        UI.renderValuationTable();
        UI.renderPortfolio();
        UI.updateTime();
        UI.showToast('✅ 数据已刷新');
    });

    // 主题切换
    const themeToggle = document.getElementById('themeToggle');
    // 加载保存的主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    themeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`;
    });

    // 导出功能
    document.getElementById('exportBtn')?.addEventListener('click', () => {
        const funds = FundData.getWatchlistFunds();
        if (funds.length === 0) {
            UI.showToast('⚠️ 没有可导出的数据');
            return;
        }

        // 生成CSV
        let csv = '基金代码,基金名称,当前净值,估算净值,日涨跌,周涨跌,近1月,年收益\n';
        funds.forEach(f => {
            csv += `${f.code},"${f.name}",${f.netValue},${f.estimatedValue},${f.dayChange}%,${f.weekChange}%,${f.monthReturn}%,${f.yearReturn}%\n`;
        });

        // 下载
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '基金智投Pro_自选基金_' + new Date().toLocaleDateString() + '.csv';
        a.click();
        URL.revokeObjectURL(url);

        UI.showToast('📥 导出成功');
    });

    // 再平衡按钮
    document.getElementById('rebalanceBtn')?.addEventListener('click', () => {
        UI.showToast('⚖️ 建议再平衡：建议股债比调整为6:4');
    });

    // 筛选器
    document.getElementById('applyFilter')?.addEventListener('click', () => {
        UI.showToast('📊 筛选功能开发中');
    });
    document.getElementById('resetFilter')?.addEventListener('click', () => {
        document.querySelectorAll('select').forEach(s => s.value = 'all');
        UI.showToast('🔄 已重置筛选条件');
    });

    // 关闭基金详情弹窗
    const closeDetail = document.getElementById('closeFundDetail');
    const fundDetailModal = document.getElementById('fundDetailModal');
    closeDetail?.addEventListener('click', () => fundDetailModal.classList.remove('show'));
    fundDetailModal?.addEventListener('click', (e) => {
        if (e.target === fundDetailModal) fundDetailModal.classList.remove('show');
    });

    setInterval(() => UI.updateTime(), 60000);
});