# COMP 4513 (Winter 2025)
### Assignment #1: Node, SQL (via supabase)

## <u>Overview</u>
This repository contains code for querying art data using Node and Express. It interacts with APIs related to galleries, paintings, genres, eras, and artists, fetching data from the art database (Supabase). The data is returned in JSON format.

## <u>Versions</u>
- **Node.js**: v22.11.0
- **Express**: 4.21.2
- **Supabase**: 2.48.1
- **Render**: For deployment - https://web3-assignment1.onrender.com/

### Example:
**Request**: /api/galleries/30

**Response:**
```json
[
  {
    "galleryId": 30,
    "galleryName": "Rijksmuseum",
    "galleryNativeName": "Rijksmuseum",
    "galleryCity": "Amsterdam",
    "galleryAddress": "Museumstraat 1, 1071 XX",
    "galleryCountry": "Netherlands",
    "latitude": 52.36,
    "longitude": 4.885278,
    "galleryWebSite": "http://www.rijksmuseum.nl/",
    "flickrPlaceId": "xfcEFYhWULKtjYI",
    "yahooWoeId": 728410,
    "googlePlaceId": "ChIJ5Ra7we4JxkcRhYVAaq5zQ9U"
  }
]
```


  | API Endpoint                                 | Description                                                                                               |
|----------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| /api/eras                                    | Returns all the eras                                                                                       |
| /api/galleries                               | Returns all the galleries |
| /api/galleries/:ref                           | Returns just the specified gallery by galleryId                      |
| /api/galleries/country/:substring            | Returns the galleries whose galleryCountry begins with the provided substring|
| /api/artists                                 | Returns all the artists (for this, and other artist requests, return all the fields in the artists table)   |
| /api/artists/:ref                             | Returns just the specified artist by artistId                          |
| /api/artists/search/:substring               | Returns the artists whose last name begins with the provided substring|
| /api/artists/country/:substring              | Returns the artists whose nationality begins with the provided substring |
| /api/paintings                               | Returns all the paintings  |
| /api/paintings/sort/sortby              | Returns all the paintings, where sortby is either title or year.                                           |
| /api/paintings/:ref                           | Returns just the specified painting                                             |
| /api/paintings/search/:substring             | Returns the paintings whose title contains the provided substring |
| /api/paintings/years/:start/:end              | Returns the paintings between two years |
| /api/paintings/galleries/:ref                | Returns all the paintings in a given gallery by galleryId    |
| /api/paintings/artist/:ref                   | Returns all the paintings by a given artist by artistId        |
| /api/paintings/artists/country/:ref          | Returns all the paintings by artists whose nationality begins with the provided substring |
| /api/genres                                  | Returns all the genres |
| /api/genres/:ref                              | Returns just the specified genre by genreId                              |
| /api/genres/painting/:ref                     | Returns the genres used in a given painting by paintingId |
| /api/paintings/genre/:ref                     | Returns all the paintings for a given genre by genreId         |
| /api/paintings/era/:ref                       | Returns all the paintings for a given era by eraId              |
| /api/counts/genres                           | Returns the genre name and the number of paintings for each genre |
| /api/counts/artists                          | Returns the artist name and the number of paintings for each artist |
| /api/counts/topgenres/:ref                    | Returns the genre name and the number of paintings for each genre, for genres having over some set number of paintings|

## <u>Testing Links</u>
- [api/eras](https://web3-assignment1.onrender.com/api/eras)
- [api/galleries](https://web3-assignment1.onrender.com/api/galleries)
- [api/galleries/30](https://web3-assignment1.onrender.com/api/galleries/30)
- [api/galleries/Calgary](https://web3-assignment1.onrender.com/api/galleries/Calgary)
- [api/galleries/country/fra](https://web3-assignment1.onrender.com/api/galleries/country/fra)
- [api/artists](https://web3-assignment1.onrender.com/api/artists)
- [api/artists/12](https://web3-assignment1.onrender.com/api/artists/12)
- [api/artists/1223423](https://web3-assignment1.onrender.com/api/artists/1223423)
- [api/artists/search/ma](https://web3-assignment1.onrender.com/api/artists/search/ma)
- [api/artists/search/mA](https://web3-assignment1.onrender.com/api/artists/search/mA)
- [api/artists/country/fra](https://web3-assignment1.onrender.com/api/artists/country/fra)
- [api/paintings](https://web3-assignment1.onrender.com/api/paintings)
- [api/paintings/sort/year](https://web3-assignment1.onrender.com/api/paintings/sort/year)
- [api/paintings/63](https://web3-assignment1.onrender.com/api/paintings/63)
- [api/paintings/search/port](https://web3-assignment1.onrender.com/api/paintings/search/port)
- [api/paintings/search/pORt](https://web3-assignment1.onrender.com/api/paintings/search/pORt)
- [api/paintings/search/connolly](https://web3-assignment1.onrender.com/api/paintings/search/connolly)
- [api/paintings/years/1800/1850](https://web3-assignment1.onrender.com/api/paintings/years/1800/1850)
- [api/paintings/galleries/5](https://web3-assignment1.onrender.com/api/paintings/galleries/5)
- [api/paintings/artist/16](https://web3-assignment1.onrender.com/api/paintings/artist/16)
- [api/paintings/artist/666](https://web3-assignment1.onrender.com/api/paintings/artist/666)
- [api/paintings/artist/country/ital](https://web3-assignment1.onrender.com/api/paintings/artist/country/ital)
- [api/genres](https://web3-assignment1.onrender.com/api/genres)
- [api/genres/76](https://web3-assignment1.onrender.com/api/genres/76)
- [api/genres/painting/408](https://web3-assignment1.onrender.com/api/genres/painting/408)
- [api/genres/painting/jsdfhg](https://web3-assignment1.onrender.com/api/genres/painting/jsdfhg)
- [api/paintings/genre/78](https://web3-assignment1.onrender.com/api/paintings/genre/78)
- [api/paintings/era/2](https://web3-assignment1.onrender.com/api/paintings/era/2)
- [api/counts/genres](https://web3-assignment1.onrender.com/api/counts/genres)
- [api/counts/artists](https://web3-assignment1.onrender.com/api/counts/artists)
- [api/counts/topgenres/20](https://web3-assignment1.onrender.com/api/counts/topgenres/20)
- [api/counts/topgenres/2034958](https://web3-assignment1.onrender.com/api/counts/topgenres/2034958)