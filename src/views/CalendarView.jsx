import { useState } from 'react'
import HeyMikeIcon from '../components/HeyMikeIcon'

// Day cell component
const DayCell = ({ day, hasContent, isToday }) => (
  <div style={{
    padding: '8px',
    borderRadius: '8px',
    minHeight: '80px',
    background: isToday ? '#EFF6FF' : 'white',
    border: hasContent ? '2px solid #2563EB' : '1px solid #F3F4F6',
    cursor: 'pointer',
    transition: 'all 0.15s',
  }}
  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#93C5FD'}
  onMouseLeave={(e) => e.currentTarget.style.borderColor = hasContent ? '#2563EB' : '#F3F4F6'}
  >
    <div style={{
      fontSize: '13px',
      fontWeight: isToday ? '600' : '400',
      color: isToday ? '#2563EB' : '#374151',
    }}>{day}</div>
    {hasContent && (
      <div style={{
        marginTop: '6px',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: '#2563EB',
      }} />
    )}
  </div>
)

// Content item on calendar
const CalendarItem = ({ time, title, platform, type }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    marginBottom: '8px',
  }}>
    <div style={{
      padding: '4px 8px',
      background: '#F3F4F6',
      borderRadius: '4px',
      fontSize: '11px',
      color: '#6B7280',
      fontWeight: '500',
    }}>{time}</div>
    <div style={{ flex: '1' }}>
      <div style={{ fontSize: '13px', fontWeight: '500', color: '#111827' }}>{title}</div>
      <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{platform}</div>
    </div>
    <span style={{
      padding: '4px 8px',
      background: type === 'video' ? '#DCFCE7' : '#EFF6FF',
      color: type === 'video' ? '#166534' : '#2563EB',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: '500',
      textTransform: 'uppercase',
    }}>{type}</span>
  </div>
)

// Calendar View
const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(19)
  
  // Sample scheduled content
  const scheduledContent = [
    { time: '9:00 AM', title: 'Hero Banner A', platform: 'Meta', type: 'image', day: 19 },
    { time: '11:00 AM', title: 'LinkedIn Post', platform: 'LinkedIn', type: 'image', day: 20 },
    { time: '2:00 PM', title: 'Instagram Reel', platform: 'Instagram', type: 'video', day: 22 },
    { time: '10:00 AM', title: 'Email Newsletter', platform: 'Email', type: 'copy', day: 24 },
  ]

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { firstDay, daysInMonth }
  }

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth)
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = 19 // Would be dynamic in real app

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1))
  }

  return (
    <div style={{ padding: '28px', height: '100%', overflow: 'auto', background: '#FAFAFA' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#111827', margin: 0 }}>Content Calendar</h1>
          <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '4px 0 0 0' }}>Schedule and manage your content</p>
        </div>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 18px',
          background: '#2563EB',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
        }}>
          <HeyMikeIcon name="plus" size={16} color="white" />
          Schedule Content
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        {/* Calendar Grid */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          {/* Month navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button onClick={() => navigateMonth(-1)} style={{
              padding: '8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderRadius: '8px',
            }}>
              <HeyMikeIcon name="chevronLeft" size={20} color="#6B7280" />
            </button>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => navigateMonth(1)} style={{
              padding: '8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              borderRadius: '8px',
            }}>
              <HeyMikeIcon name="chevronRight" size={20} color="#6B7280" />
            </button>
          </div>

          {/* Week days header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
            {weekDays.map(day => (
              <div key={day} style={{ textAlign: 'center', fontSize: '11px', color: '#9CA3AF', fontWeight: '500', padding: '8px' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
            {Array(firstDay).fill(null).map((_, i) => (
              <div key={`empty-${i}`} style={{ padding: '8px' }} />
            ))}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1
              const hasContent = scheduledContent.some(c => c.day === day)
              return (
                <DayCell 
                  key={day} 
                  day={day} 
                  hasContent={hasContent}
                  isToday={day === today}
                  onClick={() => setSelectedDay(day)}
                />
              )
            })}
          </div>
        </div>

        {/* Scheduled Content Panel */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          height: 'fit-content',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '0 0 16px 0' }}>
            Scheduled for {selectedDay}
          </h3>
          {scheduledContent.filter(c => c.day === selectedDay).length > 0 ? (
            scheduledContent.filter(c => c.day === selectedDay).map((item, i) => (
              <CalendarItem key={i} {...item} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '24px', color: '#9CA3AF', fontSize: '13px' }}>
              No content scheduled for this day
            </div>
          )}
          
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: '20px 0 16px 0' }}>
            Upcoming
          </h3>
          {scheduledContent.filter(c => c.day > selectedDay).slice(0, 3).map((item, i) => (
            <CalendarItem key={i} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CalendarView