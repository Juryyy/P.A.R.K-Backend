import { LevelEnum, TypeOfExamEnum} from "@prisma/client";


export function parseLevelEnum(value: string): LevelEnum | undefined {
    const prefix = value.substring(0, 2).toUpperCase();
    switch (prefix) {
      case 'A1':
        return LevelEnum.A1;
      case 'A2':
        return LevelEnum.A2;
      case 'B1':
        return LevelEnum.B1;
      case 'B2':
        return LevelEnum.B2;
      case 'C1':
        return LevelEnum.C1;
      case 'C2':
        return LevelEnum.C2;
      default:
        return undefined;
    }
  }

export function parseTypeOfExamEnum(value: string): TypeOfExamEnum | undefined {
  const firstWord = value.split(' ')[0];
  switch (firstWord) {
    case 'Paper':
      return TypeOfExamEnum.Paper;
    case 'Computer':
      return TypeOfExamEnum.Computer;
    default:
      return undefined;
  }
}