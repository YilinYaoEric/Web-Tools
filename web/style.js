/*
    2022/12/29
    @Yilin Yao
    Web Style Changes and setup
    This file is for changing the style of the file in an easier way. 
    Many changes will overwrite what is in the style.css
    linked to web.html
*/

"use strict";

/*
import {
    TASK_NAME_CLASS,
    BIG_TIME_CLASS,
    ALTERNATIVE_BIG_TIME,
    PREDICTED_TIME_CLASS,
    TASK_LIGHT_CLASS, 
    CIRCLE_IN_INFO_BOX_CLASS,
    EXTENTION_BLOCK_CONFIRM_CIRCLE_CLASS,
    PAGE_LEFT_ARROW_CLASS,
    PAGE_RIGHT_ARROW_CLASS 
} from "./web.js";
*/

(function(){
    window.addEventListener('load', init_styles);

    // TODO: replace with import statement
    const TASK_LIGHT_CLASS = ".task_light";
    const TASK_NAME_CLASS = ".task_name";
    const BIG_TIME_CLASS = "#first_time";
    const ALTERNATIVE_BIG_TIME = "#second_time";
    const PREDICTED_TIME_CLASS = ".predict_time";
    const PREDICTED_TIME_PREFIX = "Predicted: ";
    const CIRCLE_IN_INFO_BOX_CLASS = '.info_box .circle';
    const VECTOR_IN_INFO_BOX_CLASS = '.info_box .vector'; // TODO, make a black and white version
    const TASK_CONFIRM_CIRCLE_CLASS = '.info_box .confirm_buttom';
    const DESCRIPTION_BLOCK_TEXT_CLASS = '.info';
    const EXTENTION_BLOCK_CONFIRM_CLASS = '.extention_block .confirm_buttom';
    const EXTENTION_BLOCK_CONFIRM_CIRCLE_CLASS = '.extention_block .circle';
    const PAGE_LEFT_ARROW_CLASS = '.tasks_left_arrow';
    const PAGE_RIGHT_ARROW_CLASS = '.tasks_right_arrow';
    const TASK_CLASS = ".task";

    const NON_DARK_LIGHT_OPACITY_FOR_TASK_LIGHT = 1;
    const DARK_LIGHT_OPACITY_FOR_TASK_LIGHT = 0.2;
    const NON_DARK_LIGHT_OPACITY_FOR_TASK_NAME = 1;
    const DARK_LIGHT_OPACITY_FOR_TASK_NAME = 0.6;
    const NON_DARK_LIGHT_OPACITY_FOR_CONFIRM_CIRCLE = 1;
    const DARK_LIGHT_OPACITY_FOR_CONFIRM_CIRCLE = 0.5;

    // task bar light
    // task text
    // big time
    // predicted time
    // confirm circle
    // prev and next arrows
    const ALL_CLASSES_OF_MAJOR_COLOR = [
        TASK_NAME_CLASS,
        BIG_TIME_CLASS,
        ALTERNATIVE_BIG_TIME,
        PREDICTED_TIME_CLASS
    ];

    const ALL_CLASSES_OF_MAJOR_BACKGROUND = [
        TASK_LIGHT_CLASS, 
        CIRCLE_IN_INFO_BOX_CLASS,
        EXTENTION_BLOCK_CONFIRM_CIRCLE_CLASS
    ];

    const ALL_DARK_NEEDED_CLASSES = [
        TASK_NAME_CLASS,
        TASK_LIGHT_CLASS,
        CIRCLE_IN_INFO_BOX_CLASS,
        EXTENTION_BLOCK_CONFIRM_CIRCLE_CLASS 
    ]
    const ALL_DARK_OPACITYS = [
        DARK_LIGHT_OPACITY_FOR_TASK_NAME,
        DARK_LIGHT_OPACITY_FOR_TASK_LIGHT,
        DARK_LIGHT_OPACITY_FOR_CONFIRM_CIRCLE,
        DARK_LIGHT_OPACITY_FOR_CONFIRM_CIRCLE
    ]

    // #5BA9F1
    // e3e3e3
    const DEFULT_COLOR = '#60CF73';

    function init_styles(){
        init_color(DEFULT_COLOR);
        init_opacity();

    }

    function init_color(color) {
        for (let i = 0; i < ALL_CLASSES_OF_MAJOR_COLOR.length; i++) {
            let arr = document.querySelectorAll(ALL_CLASSES_OF_MAJOR_COLOR[i]);
            for (let j = 0; j < arr.length; j++) {
                arr[j].style.color = color;
            }
        }

        for (let i = 0; i < ALL_CLASSES_OF_MAJOR_BACKGROUND.length; i++) {
            let arr = document.querySelectorAll(ALL_CLASSES_OF_MAJOR_BACKGROUND[i]);
            for (let j = 0; j < arr.length; j++) {
                arr[j].style.backgroundColor = color;
            }
        }
        document.querySelector(PAGE_LEFT_ARROW_CLASS).style.borderRightColor = color;
        document.querySelector(PAGE_RIGHT_ARROW_CLASS).style.borderLeftColor = color;
    }

    function init_opacity() {
        for(let i = 0; i < ALL_DARK_NEEDED_CLASSES.length; i++) {
            let arr = document.querySelectorAll(ALL_DARK_NEEDED_CLASSES[i]);
            for (let j = 0; j < arr.length; j++) {
                arr[j].style.opacity = ALL_DARK_OPACITYS[i];
            }
        }
    }
})();