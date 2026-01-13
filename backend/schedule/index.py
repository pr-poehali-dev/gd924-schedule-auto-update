import json
import urllib.request
import urllib.parse

def handler(event: dict, context) -> dict:
    '''
    API для получения расписания группы ГД924/2 из Google Таблицы
    '''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }

    if method == 'GET':
        spreadsheet_id = '1FiMov0r4UUDKT6A56NWMImpoUakDC2YDevgaOpJQ7Qc'
        range_name = 'A1:Z100'
        
        url = f'https://docs.google.com/spreadsheets/d/{spreadsheet_id}/gviz/tq?tqx=out:json&range={range_name}'
        
        try:
            with urllib.request.urlopen(url) as response:
                data = response.read().decode('utf-8')
                
            json_str = data.split('(', 1)[1].rsplit(')', 1)[0]
            sheet_data = json.loads(json_str)
            
            rows = sheet_data.get('table', {}).get('rows', [])
            
            schedule = parse_schedule(rows)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'max-age=300'
                },
                'body': json.dumps(schedule, ensure_ascii=False),
                'isBase64Encoded': False
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': str(e)}, ensure_ascii=False),
                'isBase64Encoded': False
            }

    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }


def parse_schedule(rows):
    '''Парсинг расписания из строк Google Таблицы'''
    schedule = []
    days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
    colors = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    
    current_day = None
    current_lessons = []
    
    for row in rows:
        cells = row.get('c', [])
        if not cells:
            continue
        
        first_cell = cells[0]
        if first_cell and first_cell.get('v'):
            first_value = str(first_cell.get('v', '')).strip()
            
            if first_value in days:
                if current_day:
                    schedule.append({
                        'day': current_day,
                        'color': colors[days.index(current_day)],
                        'lessons': current_lessons
                    })
                current_day = first_value
                current_lessons = []
            
            elif current_day and len(cells) >= 5:
                time = get_cell_value(cells, 0)
                subject = get_cell_value(cells, 1)
                teacher = get_cell_value(cells, 2)
                room = get_cell_value(cells, 3)
                lesson_type = get_cell_value(cells, 4)
                
                if time and subject:
                    current_lessons.append({
                        'time': time,
                        'subject': subject,
                        'teacher': teacher or 'Не указан',
                        'room': room or '—',
                        'type': lesson_type or 'Занятие'
                    })
    
    if current_day and current_lessons:
        schedule.append({
            'day': current_day,
            'color': colors[days.index(current_day)],
            'lessons': current_lessons
        })
    
    return schedule


def get_cell_value(cells, index):
    '''Получение значения ячейки по индексу'''
    if index < len(cells) and cells[index]:
        value = cells[index].get('v')
        if value is not None:
            return str(value).strip()
    return ''
