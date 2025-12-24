import logo from './logo.svg'
import marvelLogo from './marvelLogo.svg'
import googlePlay from './googlePlay.svg'
import appStore from './appStore.svg'
import screenImage from './screenImage.svg'
import profile from './profile.png'


export const assets = {
  logo,
  marvelLogo,
  googlePlay,
  appStore,
  screenImage,
  profile
}


export const dummyTrailers = [
  {
    image: "https://img.youtube.com/vi/WpW36ldAqnM/maxresdefault.jpg",
    videoUrl: 'https://youtu.be/WpW36ldAqnM'
  },
  {
    image: "https://img.youtube.com/vi/-sAOWhvheK8/maxresdefault.jpg",
    videoUrl: 'https://www.youtube.com/watch?v=-sAOWhvheK8'
  },
  {
    image: "https://img.youtube.com/vi/1pHDWnXmK7Y/maxresdefault.jpg",
    videoUrl: 'https://www.youtube.com/watch?v=1pHDWnXmK7Y'
  },
  {
    image: "https://img.youtube.com/vi/umiKiW4En9g/maxresdefault.jpg",
    videoUrl: 'https://www.youtube.com/watch?v=umiKiW4En9g'
  },
  {
    image: "https://img.youtube.com/vi/aWzlQ2N6qqg/maxresdefault.jpg",
    videoUrl: 'https://www.youtube.com/watch?v=aWzlQ2N6qqg'
  },
]

const dummyCastsData = [
  { "name": "Milla Jovovich", "profile_path": "https://image.tmdb.org/t/p/original/usWnHCzbADijULREZYSJ0qfM00y.jpg", },
  { "name": "Dave Bautista", "profile_path": "https://image.tmdb.org/t/p/original/snk6JiXOOoRjPtHU5VMoy6qbd32.jpg", },
  { "name": "Arly Jover", "profile_path": "https://image.tmdb.org/t/p/original/zmznPrQ9GSZwcOIUT0c3GyETwrP.jpg", },
  { "name": "Amara Okereke", "profile_path": "https://image.tmdb.org/t/p/original/nTSPtzWu6deZTJtWXHUpACVznY4.jpg", },
  { "name": "Fraser James", "profile_path": "https://image.tmdb.org/t/p/original/mGAPQG2OKTgdKFkp9YpvCSqcbgY.jpg", },
  { "name": "Deirdre Mullins", "profile_path": "https://image.tmdb.org/t/p/original/lJm89neuiVlYISEqNpGZA5kTAnP.jpg", },
  { "name": "Sebastian Stankiewicz", "profile_path": "https://image.tmdb.org/t/p/original/hLN0Ca09KwQOFLZLPIEzgTIbqqg.jpg", },
  { "name": "Tue Lunding", "profile_path": "https://image.tmdb.org/t/p/original/qY4W0zfGBYzlCyCC0QDJS1Muoa0.jpg", },
  { "name": "Jacek Dzisiewicz", "profile_path": "https://image.tmdb.org/t/p/original/6Ksb8ANhhoWWGnlM6O1qrySd7e1.jpg", },
  { "name": "Ian Hanmore", "profile_path": "https://image.tmdb.org/t/p/original/yhI4MK5atavKBD9wiJtaO1say1p.jpg", },
  { "name": "Eveline Hall", "profile_path": "https://image.tmdb.org/t/p/original/uPq4xUPiJIMW5rXF9AT0GrRqgJY.jpg", },
  { "name": "Kamila Klamut", "profile_path": "https://image.tmdb.org/t/p/original/usWnHCzbADijULREZYSJ0qfM00y.jpg", },
  { "name": "Caoilinn Springall", "profile_path": "https://image.tmdb.org/t/p/original/uZNtbPHowlBYo74U1qlTaRlrdiY.jpg", },
  { "name": "Jan Kowalewski", "profile_path": "https://image.tmdb.org/t/p/original/snk6JiXOOoRjPtHU5VMoy6qbd32.jpg", },
  { "name": "Pawel Wysocki", "profile_path": "https://image.tmdb.org/t/p/original/zmznPrQ9GSZwcOIUT0c3GyETwrP.jpg", },
  { "name": "Simon Lööf", "profile_path": "https://image.tmdb.org/t/p/original/cbZrB8crWlLEDjVUoak8Liak6s.jpg", },
  { "name": "Tomasz Cymerman", "profile_path": "https://image.tmdb.org/t/p/original/nTSPtzWu6deZTJtWXHUpACVznY4.jpg", }
]


export const dummyShowsData = [
  {
    _id: "1",
    id: 580489,
    title: "Venom: Let There Be Carnage",
    overview:
      "Eddie Brock and Venom must face a new lethal threat when serial killer Cletus Kasady transforms into the terrifying symbiote Carnage.",
    poster_path: "https://image.tmdb.org/t/p/original/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg",
    backdrop_path: "https://image.tmdb.org/t/p/original/70nxSw3mFBsGmtkvcs91PbjerwD.jpg",
    genres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Sci-Fi" },
      { id: 14, name: "Fantasy" }
    ],
    release_date: "2021-09-30",
    original_language: "en",
    tagline: "The universe has enough superheroes.",
    vote_average: 6.8,
    vote_count: 9500,
    runtime: 97
  },
  {
    _id: "2",
    id: 634649,
    title: "Spider-Man: No Way Home",
    overview:
      "Peter Parker seeks Doctor Strange's help to make the world forget he's Spider-Man, but the spell breaks open the multiverse, unleashing powerful foes.",
    poster_path:
      "https://image.tmdb.org/t/p/original/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    backdrop_path:
      "https://image.tmdb.org/t/p/original/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg",
    genres: [
      { id: 28, name: "Action" },
      { id: 14, name: "Fantasy" },
      { id: 12, name: "Adventure" },
    ],
    casts: [],
    release_date: "2021-12-17",
    original_language: "en",
    tagline: "The Multiverse unleashed.",
    vote_average: 8.2,
    vote_count: 120000,
    runtime: 148,
  },
  {
    _id: "3",
    id: 505642,
    title: "Black Panther: Wakanda Forever",
    overview:
      "The people of Wakanda fight to protect their home from intervening world powers while mourning the death of King T'Challa.",
    poster_path:
      "https://image.tmdb.org/t/p/original/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
    backdrop_path:
      "https://image.tmdb.org/t/p/original/yYrvN5WFeGYjJnRzhY0QXuo4Isw.jpg",
    genres: [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 18, name: "Drama" },
    ],
    casts: [],
    release_date: "2022-11-11",
    original_language: "en",
    tagline: "Forever.",
    vote_average: 7.3,
    vote_count: 75000,
    runtime: 161,
  },
  {
    _id: "4",
    id: 453395,
    title: "Doctor Strange in the Multiverse of Madness",
    overview:
      "Doctor Strange teams up with a mysterious teenage girl who can travel across multiverses, to battle multiple threats.",
    poster_path:
      "https://image.tmdb.org/t/p/original/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
    backdrop_path:
      "https://image.tmdb.org/t/p/original/wRnbWt44nKjsFPrqSmwYki5vZtF.jpg",
    genres: [
      { id: 28, name: "Action" },
      { id: 14, name: "Fantasy" },
      { id: 27, name: "Horror" },
    ],
    casts: [],
    release_date: "2022-05-06",
    original_language: "en",
    tagline: "Enter a new dimension of Strange.",
    vote_average: 7.0,
    vote_count: 95000,
    runtime: 126,
  },
  {
    _id: "5",
    id: 284054,
    title: "Black Panther",
    overview:
      "T'Challa returns home to Wakanda to inherit his throne, but a powerful enemy reappears, testing his strength as king and Black Panther.",
    poster_path:
      "https://image.tmdb.org/t/p/original/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
    backdrop_path:
      "https://image.tmdb.org/t/p/original/6ELCZlTA5lGUops70hKdB83WJxH.jpg",
    genres: [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 878, name: "Sci-Fi" },
    ],
    casts: [],
    release_date: "2018-02-16",
    original_language: "en",
    tagline: "Long live the king.",
    vote_average: 7.3,
    vote_count: 140000,
    runtime: 134,
  },
  {
    _id: "6",
    id: 447365,
    title: "Guardians of the Galaxy Vol. 3",
    overview:
      "The Guardians embark on a mission to protect Rocket’s life while facing the High Evolutionary and Adam Warlock.",
    poster_path:
      "https://image.tmdb.org/t/p/original/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
    backdrop_path:
      "https://image.tmdb.org/t/p/original/qEYAJZGUqYDwFw0V3Z2TqCGkS7q.jpg",
    genres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Sci-Fi" },
      { id: 35, name: "Comedy" },
    ],
    casts: [],
    release_date: "2023-05-05",
    original_language: "en",
    tagline: "Once more with feeling.",
    vote_average: 8.1,
    vote_count: 95000,
    runtime: 150,
  },
  {
    _id: "7",
    id: 640146,
    title: "The Marvels",
    overview:
      "Carol Danvers, Monica Rambeau, and Kamala Khan must team up when their powers become entangled, forcing them to work together to save the universe.",
    poster_path:
      "https://image.tmdb.org/t/p/original/Ag7VUdnrRz5Qpq3Yn3E5OCvFnuP.jpg",
    backdrop_path:
      "https://image.tmdb.org/t/p/original/fbAZ94qR4tWi3LuMbQWl9hr8h84.jpg",
    genres: [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 878, name: "Sci-Fi" },
    ],
    casts: [],
    release_date: "2023-11-10",
    original_language: "en",
    tagline: "Higher. Further. Faster. Together.",
    vote_average: 6.1,
    vote_count: 25000,
    runtime: 105,
  },
];
export const dummyDateTimeData = {
  "2025-07-24": [
    { "time": "2025-07-24T01:00:00.000Z", "showId": "68395b407f6329be2bb45bd1" },
    { "time": "2025-07-24T03:00:00.000Z", "showId": "68395b407f6329be2bb45bd2" },
    { "time": "2025-07-24T05:00:00.000Z", "showId": "68395b407f6329be2bb45bd3" }
  ],
  "2025-07-25": [
    { "time": "2025-07-25T01:00:00.000Z", "showId": "68395b407f6329be2bb45bd4" },
    { "time": "2025-07-25T03:00:00.000Z", "showId": "68395b407f6329be2bb45bd5" },
    { "time": "2025-07-25T05:00:00.000Z", "showId": "68395b407f6329be2bb45bd6" }
  ],
  "2025-07-26": [
    { "time": "2025-07-26T01:00:00.000Z", "showId": "68395b407f6329be2bb45bd7" },
    { "time": "2025-07-26T03:00:00.000Z", "showId": "68395b407f6329be2bb45bd8" },
    { "time": "2025-07-26T05:00:00.000Z", "showId": "68395b407f6329be2bb45bd9" }
  ],
  "2025-07-27": [
    { "time": "2025-07-27T01:00:00.000Z", "showId": "68395b407f6329be2bb45bda" },
    { "time": "2025-07-27T03:00:00.000Z", "showId": "68395b407f6329be2bb45bdb" },
    { "time": "2025-07-27T05:00:00.000Z", "showId": "68395b407f6329be2bb45bdc" }
  ]
}

export const dummyDashboardData = {
  "totalBookings": 14,
  "totalRevenue": 1517,
  "totalUser": 5,
  "activeShows": [
    {
      "_id": "68352363e96d99513e4221a4",
      "movie": dummyShowsData[0],
      "showDateTime": "2025-06-30T02:30:00.000Z",
      "showPrice": 59,
      "occupiedSeats": {
        "A1": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
        "B1": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
        "C1": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok"
      },
    },
    {
      "_id": "6835238fe96d99513e4221a8",
      "movie": dummyShowsData[1],
      "showDateTime": "2025-06-30T15:30:00.000Z",
      "showPrice": 81,
      "occupiedSeats": {},
    },
    {
      "_id": "6835238fe96d99513e4221a9",
      "movie": dummyShowsData[2],
      "showDateTime": "2025-06-30T03:30:00.000Z",
      "showPrice": 81,
      "occupiedSeats": {},
    },
    {
      "_id": "6835238fe96d99513e4221aa",
      "movie": dummyShowsData[3],
      "showDateTime": "2025-07-15T16:30:00.000Z",
      "showPrice": 81,
      "occupiedSeats": {
        "A1": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
        "A2": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
        "A3": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
        "A4": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok"
      },
    },
    {
      "_id": "683682072b5989c29fc6dc0d",
      "movie": dummyShowsData[4],
      "showDateTime": "2025-06-05T15:30:00.000Z",
      "showPrice": 49,
      "occupiedSeats": {
        "A1": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
        "A2": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
        "A3": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
        "B1": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
        "B2": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
        "B3": "user_2xO4XPCgWWwWq9EHuQxc5UWqIok"
      },
      "__v": 0
    },
    {
      "_id": "68380044686d454f2116b39a",
      "movie": dummyShowsData[5],
      "showDateTime": "2025-06-20T16:00:00.000Z",
      "showPrice": 79,
      "occupiedSeats": {
        "A1": "user_2xl7eCSUHddibk5lRxfOtw9RMwX",
        "A2": "user_2xl7eCSUHddibk5lRxfOtw9RMwX"
      }
    }
  ]
}


export const dummyBookingData = [
  {
    "_id": "68396334fb83252d82e17295",
    "user": { "name": "GreatStack", },
    "show": {
      _id: "68352363e96d99513e4221a4",
      movie: dummyShowsData[0],
      showDateTime: "2025-06-30T02:30:00.000Z",
      showPrice: 59,
    },
    "amount": 98,
    "bookedSeats": ["D1", "D2"],
    "isPaid": false,
  },
  {
    "_id": "68396334fb83252d82e17295",
    "user": { "name": "GreatStack", },
    "show": {
      _id: "68352363e96d99513e4221a4",
      movie: dummyShowsData[0],
      showDateTime: "2025-06-30T02:30:00.000Z",
      showPrice: 59,
    },
    "amount": 49,
    "bookedSeats": ["A1"],
    "isPaid": true,
  },
  {
    "_id": "68396334fb83252d82e17295",
    "user": { "name": "GreatStack", },
    "show": {
      _id: "68352363e96d99513e4221a4",
      movie: dummyShowsData[0],
      showDateTime: "2025-06-30T02:30:00.000Z",
      showPrice: 59,
    },
    "amount": 147,
    "bookedSeats": ["A1", "A2", "A3"],
    "isPaid": true,
  },
]



