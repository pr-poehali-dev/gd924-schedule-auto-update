import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Lesson {
  time: string;
  subject: string;
  teacher: string;
  room: string;
  type: string;
}

interface DaySchedule {
  day: string;
  color: string;
  lessons: Lesson[];
}

const API_URL = 'https://functions.poehali.dev/46a587be-7147-46f2-923f-294d13c1e856';

const Index = () => {
  const [currentDay, setCurrentDay] = useState<number>(0);
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().getDay();
    setCurrentDay(today === 0 ? 6 : today - 1);
  }, []);

  useEffect(() => {
    fetchSchedule();
    const interval = setInterval(fetchSchedule, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Ошибка загрузки расписания');
      const data = await response.json();
      setSchedule(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      setSchedule(fallbackSchedule);
    } finally {
      setLoading(false);
    }
  };

  const fallbackSchedule: DaySchedule[] = [
    {
      day: 'Понедельник',
      color: 'monday',
      lessons: [
        { time: '09:00 - 10:30', subject: 'Математика', teacher: 'Иванов И.И.', room: '301', type: 'Лекция' },
        { time: '10:45 - 12:15', subject: 'Программирование', teacher: 'Петрова А.С.', room: '205', type: 'Практика' },
        { time: '12:30 - 14:00', subject: 'Физика', teacher: 'Сидоров В.П.', room: '410', type: 'Лекция' },
        { time: '14:15 - 15:45', subject: 'Английский язык', teacher: 'Смирнова Е.А.', room: '112', type: 'Семинар' },
      ]
    },
    {
      day: 'Вторник',
      color: 'tuesday',
      lessons: [
        { time: '09:00 - 10:30', subject: 'История', teacher: 'Козлов М.В.', room: '215', type: 'Лекция' },
        { time: '10:45 - 12:15', subject: 'Алгоритмы', teacher: 'Петрова А.С.', room: '205', type: 'Лекция' },
        { time: '12:30 - 14:00', subject: 'Базы данных', teacher: 'Новиков С.А.', room: '308', type: 'Практика' },
      ]
    },
    {
      day: 'Среда',
      color: 'wednesday',
      lessons: [
        { time: '09:00 - 10:30', subject: 'Веб-разработка', teacher: 'Морозов Д.К.', room: '201', type: 'Практика' },
        { time: '10:45 - 12:15', subject: 'Математика', teacher: 'Иванов И.И.', room: '301', type: 'Семинар' },
        { time: '12:30 - 14:00', subject: 'Физкультура', teacher: 'Орлов П.Т.', room: 'Спортзал', type: 'Практика' },
        { time: '14:15 - 15:45', subject: 'Философия', teacher: 'Белова О.Н.', room: '115', type: 'Лекция' },
      ]
    },
    {
      day: 'Четверг',
      color: 'thursday',
      lessons: [
        { time: '09:00 - 10:30', subject: 'Сети и протоколы', teacher: 'Волков А.Р.', room: '404', type: 'Лекция' },
        { time: '10:45 - 12:15', subject: 'Программирование', teacher: 'Петрова А.С.', room: '205', type: 'Лабораторная' },
        { time: '12:30 - 14:00', subject: 'Английский язык', teacher: 'Смирнова Е.А.', room: '112', type: 'Практика' },
      ]
    },
    {
      day: 'Пятница',
      color: 'friday',
      lessons: [
        { time: '09:00 - 10:30', subject: 'Дизайн интерфейсов', teacher: 'Кузнецова Л.М.', room: '220', type: 'Лекция' },
        { time: '10:45 - 12:15', subject: 'Базы данных', teacher: 'Новиков С.А.', room: '308', type: 'Лабораторная' },
        { time: '12:30 - 14:00', subject: 'Проектная работа', teacher: 'Морозов Д.К.', room: '201', type: 'Практика' },
        { time: '14:15 - 15:45', subject: 'Экономика', teacher: 'Павлова Т.С.', room: '320', type: 'Лекция' },
      ]
    },
    {
      day: 'Суббота',
      color: 'saturday',
      lessons: [
        { time: '09:00 - 10:30', subject: 'Консультация', teacher: 'Иванов И.И.', room: '301', type: 'Консультация' },
        { time: '10:45 - 12:15', subject: 'Дополнительные занятия', teacher: 'Петрова А.С.', room: '205', type: 'Практика' },
      ]
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Лекция': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Практика': return 'bg-green-100 text-green-800 border-green-200';
      case 'Семинар': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Лабораторная': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Консультация': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-heading font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Расписание ГД924/2
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Icon name="Calendar" size={20} />
            Учебная неделя
          </p>
          {error && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
              <Icon name="AlertCircle" size={16} />
              {error} — используется резервное расписание
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Загрузка расписания...</p>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedule.map((dayData, dayIndex) => (
            <Card 
              key={dayIndex}
              className={`overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 animate-scale-in border-2 ${
                currentDay === dayIndex ? 'ring-4 ring-offset-2 ring-purple-400' : ''
              }`}
              style={{ animationDelay: `${dayIndex * 100}ms` }}
            >
              <div 
                className={`bg-gradient-to-r p-6 text-white`}
                style={{
                  background: `linear-gradient(135deg, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%)`,
                  '--tw-gradient-from': `var(--${dayData.color})`,
                  '--tw-gradient-to': `color-mix(in srgb, var(--${dayData.color}) 70%, black)`
                } as React.CSSProperties}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-heading font-bold">{dayData.day}</h2>
                  {currentDay === dayIndex && (
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      Сегодня
                    </div>
                  )}
                </div>
                <p className="text-white/90 mt-1 flex items-center gap-1">
                  <Icon name="BookOpen" size={16} />
                  {dayData.lessons.length} {dayData.lessons.length === 1 ? 'занятие' : 'занятия'}
                </p>
              </div>

              <div className="p-4 space-y-3">
                {dayData.lessons.map((lesson, lessonIndex) => (
                  <div 
                    key={lessonIndex}
                    className="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{lesson.subject}</h3>
                        <div className={`inline-block px-2 py-1 rounded-md text-xs font-medium border ${getTypeColor(lesson.type)}`}>
                          {lesson.type}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Icon name="Clock" size={14} />
                        {lesson.time}
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Icon name="User" size={14} />
                        <span>{lesson.teacher}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Icon name="MapPin" size={14} />
                        <span>Ауд. {lesson.room}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
        )}

        <div className="mt-8 text-center">
          <Card className="inline-block p-4 bg-white/80 backdrop-blur-sm">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Icon name="Info" size={16} />
              Расписание автоматически обновляется из Google Таблицы
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;