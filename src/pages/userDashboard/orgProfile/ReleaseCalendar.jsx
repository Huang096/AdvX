import React from 'react';
import GitHubCalendar from 'react-github-calendar';

const ReleaseCalendar = () => {
    // Mock data for demo purposes
    const releaseData = [
        { date: '2024-07-02', count: 1, level: 1 },
        { date: '2024-07-05', count: 2, level: 2 },
        { date: '2024-07-10', count: 1, level: 1 },
        { date: '2024-07-15', count: 3, level: 3 },
        { date: '2024-07-20', count: 1, level: 1 },
    ];

    return (
        <div className="card bg-base-100 shadow-xl p-4">
            <h2 className="card-title mb-4">我的发布日历</h2>
            <div className="text-center">
                <GitHubCalendar 
                    username="placeholder"
                    blockSize={14}
                    blockMargin={4}
                    fontSize={12}
                    data={releaseData} // Use our specific release data
                    hideTotalCount
                    hideColorLegend
                    showWeekdayLabels
                />
            </div>
            <p className="text-xs text-center mt-2">这里记录了您为狗狗们发布新鲜事的每一天。</p>
        </div>
    );
};

export default ReleaseCalendar; 