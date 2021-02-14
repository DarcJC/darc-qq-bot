

/**
 * https://blog.csdn.net/qq_35079650/article/details/97271649
 * 推荐format "yyyyMMdd HH:mm:ss"
 * @param time 
 * @param format 
 */
export function formatDateSemantic (time: string | number,  format: string) {
    if (!time) {
      return ''
    }
  
    if (typeof time === 'string') {
      time = time.replace('T', ' ').replace(new RegExp('-', 'gm'), '/')
    }
  
    let t = new Date(time)
  
    if (t.getTime() === 0) {
      t = new Date()
    }
  
    let tf = function (i) {
      return (i < 10 ? '0' : '') + i
    }
    if (!format) {
      format = 'yyyyMMdd HH:mm:ss'
    }
  
    let nowTime = new Date();
    let currentYear = nowTime.getFullYear();
    let currentMonth = nowTime.getMonth();
    let currentDate = nowTime.getDate();
  
    let sameYear = currentYear === t.getFullYear();
    let sameMonth = currentMonth === t.getMonth();
  
  
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (type) {
      switch (type) {
        case 'yyyy':
          return currentYear === t.getFullYear() ? "" : tf(t.getFullYear()) + '年';
        case 'MM':
          return (sameYear && sameMonth) ? "" : tf(t.getMonth() + 1) + '月';
        case 'dd':
          if (sameYear && sameMonth) {
            if (currentDate === t.getDate()) {
              return "";
            } else if ((currentDate - 1) === t.getDate()) {
              return "昨天";
            } else if ( (currentDate - 2) === t.getDate() ) {
              return "前天";
            } else {
              return tf(t.getDate()) + '日';
            }
          } else {
            return tf(t.getDate()) + '日';
          }
        case 'HH':
          return tf(t.getHours());
        case 'mm':
          return tf(t.getMinutes())
        case 'ss':
          return tf(t.getSeconds())
      }
    })
  }

export function parseDestinyClass(type: number) {
    switch (type) {
        case 0:
            return '泰坦'
        case 1:
            return '猎人'
        case 2:
            return '术士'
        default:
            return '未知'
      }
}

export function parseDestinyRace(type: number) {
  switch (type) {
      case 0:
          return '人类'
      case 1:
          return '觉醒者'
      case 2:
          return 'EXO'
      default:
          return '未知'
    }
}
