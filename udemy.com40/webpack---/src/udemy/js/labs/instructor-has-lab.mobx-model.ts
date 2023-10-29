import {action, computed, observable} from 'mobx';

import {APIModel} from 'utils/mobx';

import {LAB_INSTRUCTOR_PERMISSIONS} from '../lab-manage/constants';
import {InstructorDetailsApiData, InstructorHasLabPermissionsApiData} from './types';

export class InstructorHasLabModel extends APIModel {
    @observable id?: number;
    @observable declare isOwner: boolean;
    @observable declare isVisible: boolean;
    @observable declare permissions: string[];
    @observable declare revenueSharePercentage: number;
    @observable declare instructor: InstructorDetailsApiData;

    get apiDataMap() {
        return {
            id: 'id',
            isOwner: 'is_owner',
            isVisible: 'is_visible',
            permissions: {
                source: 'permissions',
                map: (data: InstructorHasLabPermissionsApiData[]) => {
                    return data.map((item) => item.permission);
                },
                defaultValue: [],
            },
            revenueSharePercentage: 'revenue_share_percentage',
            instructor: 'instructor',
        };
    }

    hasPermission(permission: string) {
        return this.permissions?.includes(permission);
    }

    @action
    addPermission(permission: string) {
        return this.permissions.push(permission);
    }

    @action
    removePermission(permission: string) {
        this.permissions = this.permissions.filter((code) => code !== permission);
    }

    @action
    setRevenuePercentage(value: number) {
        this.revenueSharePercentage = value;
    }

    @action
    setVisible(visibility: boolean) {
        this.isVisible = visibility;
    }

    @computed
    get permissionsToSave() {
        return Object.values(LAB_INSTRUCTOR_PERMISSIONS).map((code) => {
            return {permission_code: code, enabled: this.hasPermission(code)};
        });
    }
}
