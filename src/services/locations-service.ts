import { PrismaClient, ExamLocation, ExamVenue, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default {
  async getLocationsWithVenues() {
    return await prisma.examLocation.findMany({
      include: {
        venues: true,
      },
    });
  },

  async getLocations() {
    return await prisma.examLocation.findMany();
  },

  async getVenues() {
    return await prisma.examVenue.findMany();
  },

  async addLocation(location : string) {
    return await prisma.examLocation.create({
      data: {
        name : location
      }
    });
},

  async addVenue(data: Prisma.ExamVenueCreateInput) {
    return await prisma.examVenue.create({
      data
    });
  },

  async updateLocation(location: ExamLocation) {
    return await prisma.examLocation.update({
      where: {
        id: location.id,
      },
      data: location,
    });
  },

  async updateVenue(venue: ExamVenue) {
    return await prisma.examVenue.update({
      where: {
        id: venue.id,
      },
      data: venue,
    });
  },

  async deleteLocation(id : number) {
    return await prisma.examLocation.delete({
      where: {
        id,
      },
    });
  },

  async deleteVenue(id : number) {
    return await prisma.examVenue.delete({
      where: {
        id,
      },
    });
  },
  
  async getLocation(data : Prisma.ExamLocationWhereUniqueInput) {
    return await prisma.examLocation.findUnique({
      where: data
    });
  }, 

  async getLocationById(id : number) {
    return await prisma.examLocation.findUnique({
      where: {
        id
      },
      include: {
        venues: true
      }
    });
  },

  async getVenue(nameVenue: string, locationId: number) {
    return await prisma.examVenue.findUnique({
      where: {
        name_locationId: {
          name: nameVenue,
          locationId
        }
      }
    });
  },

  async getVenueById(id : number){
    return await prisma.examVenue.findUnique({
      where : {
        id
      }
    });
  },
};
