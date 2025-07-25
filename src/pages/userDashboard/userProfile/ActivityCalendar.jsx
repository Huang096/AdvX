import React from 'react';
import GitHubCalendar from 'react-github-calendar';

const ActivityCalendar = () => {
    // 模拟的活跃度数据
    // In a real app, you would fetch this data
    const activityData = [
        { date: '2024-07-01', count: 3, level: 3 },
        { date: '2024-07-03', count: 1, level: 1 },
        { date: '2024-07-04', count: 2, level: 2 },
        { date: '2024-07-08', count: 4, level: 4 },
        { date: '2024-07-12', count: 2, level: 2 },
        { date: '2024-07-22', count: 5, level: 4 },
        // ... more data
    ];

    return (
        <div className="card bg-base-100 shadow-xl p-4">
            <h2 className="card-title mb-4">我的关注日历</h2>
            <div className="text-center">
                <GitHubCalendar 
                    username="placeholder" // This is required but we'll hide it
                    blockSize={14}
                    blockMargin={4}
                    fontSize={12}
                    data={activityData}
                    hideTotalCount
                    hideColorLegend
                    showWeekdayLabels
                />
            </div>
            <p className="text-xs text-center mt-2">这里记录了您关注和支持狗狗的每一天。</p>
        </div>
    );
};

export default ActivityCalendar; 