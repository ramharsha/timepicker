import React, { useState, useEffect } from 'react';
import './TimePicker.css';
import moment, { Moment } from 'moment';
import { TimePickerProps } from './TimePicker.types';

const TimePicker: React.FC<TimePickerProps> = ({ 
    label = '', 
    value, 
    onChange = () => {}, 
    disabled = false 
}) => {
    const [time, setTime] = useState<string>(value || '');

    useEffect(() => {
        setTime(value || '');
    }, [value]);

    const callOnChange = (newValue: string | null) => {
        if (typeof onChange === 'function') {
            onChange(newValue);
        }
    }

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setTime(newValue);
        callOnChange(newValue);
    };

    const handleBlur = () => {
        const parsedTime = parseTime(time);
        const formattedTime = parsedTime ? parsedTime.format("hh:mm a") : '';
        
        callOnChange(formattedTime);
        setTime(formattedTime);
    };

    const parseTime = (input: string): Moment | null => {
        let amPm = 'a';
        let hours: number | undefined;
        let minutes: number | undefined;

        if (input) {
            let timeTemp = input.toLowerCase().replace(/:|\s/g, '');

            if (timeTemp.endsWith('a') || timeTemp.endsWith('p')) {
                amPm = timeTemp.slice(-1);
                timeTemp = timeTemp.slice(0, -1);
            } else if (timeTemp.endsWith('am') || timeTemp.endsWith('pm')) {
                amPm = timeTemp.slice(-2).charAt(0);
                timeTemp = timeTemp.slice(0, -2);
            }

            try {
                if (timeTemp.length === 1 || timeTemp.length === 2) {
                    hours = +timeTemp;
                    minutes = 0;
                } else if (timeTemp.length > 2) {
                    minutes = +timeTemp.slice(-2);
                    timeTemp = timeTemp.slice(0, -2);
                    hours = +timeTemp;
                } else {
                    return null;
                }

                if (hours < 12 && hours >= 1 && amPm === 'p') {
                    hours += 12;
                } else if (hours === 12 && amPm === 'a') {
                    hours = 0;
                }
            } catch (error) {
                return null;
            }

            const momentTime = moment({ hours, minutes });
            return momentTime.isValid() ? momentTime : null;
        }
        return null;
    };

    return (
        <div className="input-wrapper">
            <label>{label}</label>
            <input
                type="text"
                value={time}
                onChange={handleValueChange}
                onBlur={handleBlur}
                disabled={disabled}
                autoComplete="off"
            />
        </div>
    );
};

export default TimePicker;