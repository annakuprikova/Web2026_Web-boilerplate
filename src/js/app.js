import { randomUserMock, additionalUsers } from './FE4U-Lab2-mock.js';

// ---------------------- TASK 1 ---------------------------
// Форматування користувачів

function getId(user) {
    if (typeof user.id === "string") {
        return user.id;
    }
    if (user.id?.name && user.id?.value) {
        return user.id.name + user.id.value;
    }
    return null;
}

function findMatchingUser(users, user) {
    const id = getId(user);

    return users.find(item => {
        return (id && getId(item) === id) || item.email === user.email;
    });
}

function getRandomCourse() {
    const courses = [
        "Mathematics",
        "Physics",
        "English",
        "Computer Science",
        "Dancing",
        "Chess",
        "Biology",
        "Chemistry",
        "Law",
        "Art",
        "Medicine",
        "Statistics"
    ];

    const index = Math.floor(Math.random() * courses.length);
    return courses[index];
}

function formatUser(user) {
    const gender = user.gender;
    const title = user.title || user.name?.title;
    const fullName = user.full_name || `${user.name.first} ${user.name.last}`;
    const city = user.city || user.location?.city;
    const state = user.state || user.location?.state;
    const country = user.country || user.location?.country;
    const postcode = user.postcode || user.location?.postcode;
    const coordinates = user.coordinates || user.location?.coordinates;
    const timezone = user.timezone || user.location.timezone;
    const email = user.email;
    const bDay = user.b_day || user.dob?.date;
    const age = user.age || user.dob?.age;
    const phone = user.phone || null;
    const pictureLarge = user.picture_large || user.picture?.large || null;
    const pictureThumbnail = user.picture_thumbnail || user.picture?.thumbnail || null;

    return {
        gender: gender,
        title: title,
        full_name: fullName,
        city: city,
        state: state,
        country: country,
        postcode: postcode,
        coordinates: coordinates,
        timezone: timezone,
        email: email,
        b_day: bDay,
        age: age,
        phone: phone,
        picture_large: pictureLarge,
        picture_thumbnail: pictureThumbnail,

        id: getId(user),
        favorite: user.favorite || false,
        course: getRandomCourse(),
        bg_color: user.bg_color || "#ff0000",
        note: user.note || "Notes here..."
    };
}

function mergeUsers(randomUserMock, additionalUsers) {
    const result = [];
    const allUsers = [...randomUserMock, ...additionalUsers];

    allUsers.forEach(user => {
        const existingUser = findMatchingUser(result, user);

        if (existingUser) {
            const index = result.indexOf(existingUser);

            result[index] = {
                ...existingUser,
                ...user
            };
        } else {
            result.push(user);
        }
    });

    return result;
}

function processUsers(randomUserMock, additionalUsers) {
    const uniqueUsers = mergeUsers(randomUserMock, additionalUsers);
    return uniqueUsers.map(user => {
        return formatUser(user);
    });
}



// ---------------------- TASK 2 ---------------------------
// Валідація об'єкта
function isStringAndStartsWithUppercase(value) {
    if (typeof value !== "string" || value.length === 0) return false;
    return value[0] === value[0].toUpperCase();
}

function validateAge(age) {
    return typeof age === "number" && age > 0;
}

function validatePhone(phone) {
    if (typeof phone !== "string") return false;
    const digitsOnly = phone.replace(/\D/g, "");
    return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

function validateEmail(email) {
    if (typeof email !== "string") return false;
    return email.includes("@");
}

function validateUser(user) {
    const validFullName = isStringAndStartsWithUppercase(user.full_name);
    const validGender = isStringAndStartsWithUppercase(user.gender);
    const validNote = isStringAndStartsWithUppercase(user.note);
    const validState = isStringAndStartsWithUppercase(user.state);
    const validCity = isStringAndStartsWithUppercase(user.city);
    const validCountry = isStringAndStartsWithUppercase(user.country);
    const validAge = validateAge(user.age);
    const validPhone = validatePhone(user.phone, user.country);
    const validEmail = validateEmail(user.email);

    return (
        validFullName &&
        validGender &&
        validNote &&
        validState &&
        validCity &&
        validCountry &&
        validAge &&
        validPhone &&
        validEmail
    );
}

function getUsersValidationStatus(usersList) {
    const ValidatedUsers = usersList.map(user => {
        return {
            id: user.id,
            full_name: user.full_name,
            gender: user.gender,
            note: user.note,
            state: user.state,
            city: user.city,
            country: user.country,
            age: user.age,
            phone: user.phone,
            email: user.email,
            valid: validateUser(user)
        }
    });
    return ValidatedUsers;
}



// ---------------------- TASK 3 ---------------------------
// Фільтрація за параметрами
function filterUsers(users, country, age, gender, favorite) {
    return users.filter(user => {
        const matchCountry = country === undefined || user.country === country;
        const matchAge = age === undefined || user.age === age;
        const matchGender = gender === undefined || user.gender === gender;
        const matchFavorite = favorite === undefined || user.favorite === favorite;

        return matchCountry && matchAge && matchGender && matchFavorite;
    });
}



// ---------------------- TASK 4 ---------------------------
// Сортування за параметром
function sortUsers(users, field, ascending = true) {
    const sortedUsers = [...users];

    return sortedUsers.sort((a, b) => {
        if (typeof a[field] === "number" && typeof b[field] === "number") {
            return ascending
                ? a[field] - b[field]
                : b[field] - a[field];
        }

        if (typeof a[field] === "string" && typeof b[field] === "string") {
            return ascending
                ? a[field].localeCompare(b[field])
                : b[field].localeCompare(a[field]);
        }

        return 0;
    });
}



// ---------------------- TASK 5 ---------------------------
// Пошук об'єкта
function findUserByField(users, field, value) {
    return users.find(user => {
        return user[field] === value;
    });
}



// ---------------------- TASK 6 ---------------------------
// Відсоток користувачів, які відповідають умові
function calculatePercentage(users, field, operator, value) {
    let matchingUsers;

    if (operator === ">") {
        matchingUsers = users.filter(user => {
            return user[field] > value;
        });
    }
    if (operator === ">=") {
        matchingUsers = users.filter(user => {
            return user[field] >= value;
        });
    }
    if (operator === "<") {
        matchingUsers = users.filter(user => {
            return user[field] < value;
        });
    }
    if (operator === "<=") {
        matchingUsers = users.filter(user => {
            return user[field] <= value;
        });
    }
    if (operator === "===") {
        matchingUsers = users.filter(user => {
            return user[field] === value;
        });
    }
    if (users.length === 0) {
        return 0;
    }

    return (matchingUsers.length / users.length) * 100;
}



// ---------------------- HELPERS ---------------------------
function countDuplicates(randomUserMock, additionalUsers) {
    const allUsers = [...randomUserMock, ...additionalUsers];
    const uniqueUsers = mergeUsers(randomUserMock, additionalUsers);

    return allUsers.length - uniqueUsers.length;
}

function getCountry(users) {
    return users.map(user => user.country);
}



// ---------------------- MAIN ---------------------------
//01
console.log("---------------------- TASK 1 ---------------------------");
const users = processUsers(randomUserMock, additionalUsers);
console.log(users);
console.log("RandomUserMock кількість: ", randomUserMock.length);
console.log("AdditionalUsers кількість: ", additionalUsers.length);
console.log("Дублікати: ", countDuplicates(randomUserMock, additionalUsers));
console.log("Кількість користувачів в об'єднаному списку: ", users.length);
console.log(getCountry(users));


//02
console.log("---------------------- TASK 2 ---------------------------");
console.log(getUsersValidationStatus(users));


//03
console.log("---------------------- TASK 3 ---------------------------");
console.log("Результат фільтрації користувача за параметрами: ");
console.log(filterUsers(users, "Germany", 65, "male", true));


//04
console.log("---------------------- TASK 4 ---------------------------");
const usersByAge_Asc = sortUsers(users, "age", true);
console.log("За віком за зростанням:");
console.log(usersByAge_Asc);

const usersByName_Des = sortUsers(users, "full_name", false);
console.log("За іменем за спаданням:");
console.log(usersByName_Des);

const usersByBd_Asc = sortUsers(users, "b_day", true);
console.log("За датою народження за зростанням:");
console.log(usersByBd_Asc);


//05
console.log("---------------------- TASK 5 ---------------------------");
console.log("Пошук за ім'ям:");
const foundByName = findUserByField(users, "full_name", "Norbert Weishaupt");
console.log(foundByName);

console.log("Пошук за віком:");
const foundByAge = findUserByField(users, "age", 65);
console.log(foundByAge);

console.log("Пошук за нотатками:");
const foundByNote = findUserByField(users, "note", "Notes here...");
console.log(foundByNote);


//06
console.log("---------------------- TASK 6 ---------------------------");
const percentage1 = calculatePercentage(users, "age", ">", 30);
const usersOver30 = users.filter(user => user.age > 30);
console.log("Кількість користувачів: ", users.length)
console.log("Кількість користувачів старших за 30 років: ", usersOver30.length)
console.log("Відсоток користувачів старше 30 років:", percentage1 + "%");

const percentage2 = calculatePercentage(users, "gender", "===", "female");
const usersFemale = users.filter(user => user.gender === "female");
console.log("Кількість користувачів: ", users.length)
console.log("Кількість жінок: ", usersFemale.length)
console.log("Відсоток жінок:", percentage2 + "%");