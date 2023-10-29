import Cookies from 'js-cookie';

export function loadSetting(setting) {
    return Cookies.get(setting);
}

export function saveSetting(setting, value) {
    Cookies.set(setting, value, {expires: 30, path: '/'});
}

export function clearSetting(setting) {
    return Cookies.remove(setting);
}
