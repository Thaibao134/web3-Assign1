# COMP 4513 (Winter 2025)
### Assignment #1: Node, SQL (via supabase)

**Please view `COMP4513 Assignment 1.pdf` for instructions**

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
| /api/paintings/sort/:title|:year              | Returns all the paintings, sorted by either title or year.                                           |
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
