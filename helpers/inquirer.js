const inquirer = require('inquirer');

const questions = [
    {
        type: 'list',
        name: 'option',
        message: '¿Qué deses hacer?',
        choices: [
            {
                value: 1,
                name: '1. Buscar Ciudad'
            },
            {
                value: 2,
                name: '2. Historial'
            },
            {
                value: 0,
                name: '0. Salir'
            },
        ]
    }
];

const inquirerMenu = async () => {
    console.clear();
    console.log('=====Seleccione una opción=====');

    const { option } = await inquirer.prompt(questions);
    return option;
}

const pause = async () => {
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ENTER para continuar`
        }
    ];
    console.log('\n');
    await inquirer.prompt(question);
}

const readInput = async (message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value) {
                if (value.length === 0) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];
    const { desc } = await inquirer.prompt(question);
    return desc;
}
const getPlaces = async (places = []) => {
    const choices = places.map((place, i) => {
        const idx = i + 1;

        return {
            value: place.id,
            name: `${idx}. ${place.name}`

        }
    });
    choices.unshift({
        value: '0',
        name: '0 Cancelar'
    });
    const questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Select place: ',
            choices
        }
    ];
    const { id } = await inquirer.prompt(questions);
    return id;
}
const showData = async (tasks = []) => {
    const choices = tasks.map((task, i) => {
        const idx = i + 1;
        const status = (task.doneDate)
            ? 'Completada: ' + task.doneDate
            : 'Pendiente'
        return {
            value: task.id,
            name: `${idx} ${task.desc} :: ${status}`,
            checked: (task.doneDate) ? true : false
        }
    });

    const questions = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione ',
            choices
        }
    ];
    const { ids } = await inquirer.prompt(questions);
    return ids;
}
const confirm = async (message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];
    const { ok } = await inquirer.prompt(question);
    return ok;
}
module.exports = {
    inquirerMenu,
    pause,
    readInput,
    getPlaces,
    confirm,
    showData
}