import Cookies from 'js-cookie';

export function loadSetting(setting: any): any {
    return Cookies.get(setting);
}

export function saveSetting(setting: any, value: any): any {
    Cookies.set(setting, value, {expires: 30, path: '/'});
}

export function clearSetting(setting: any): any {
    return Cookies.remove(setting);
}
