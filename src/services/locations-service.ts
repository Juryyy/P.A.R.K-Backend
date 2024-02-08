import { PrismaClient, ExamLocation, ExamVenue } from "@prisma/client";

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

  async addVenue(name : string, locationId : number) {
    return await prisma.examVenue.create({
      data: {
        name,
        locationId
      }
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
  async deleteLocation(location: ExamLocation) {
    return await prisma.examLocation.delete({
      where: {
        id: location.id,
      },
    });
  },
  async deleteVenue(venue: ExamVenue) {
    return await prisma.examVenue.delete({
      where: {
        id: venue.id,
      },
    });
  },
  async getLocationByName(name: string) {
    return await prisma.examLocation.findFirst({
      where: {
        name,
      },
    });
  }
};
