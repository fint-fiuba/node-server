type Species = 'DOG' | 'CAT'
type Sex = 'MALE' | 'FEMALE'

/**
Modela una mascota
Agregar documentacion
...
**/
type IPet = {
    petName: String;
    petSpecies: Species;
    petSex: Sex;
    petAge: number;
    petDescription: string;
}

function petsAreCompatible(pet1: IPet, pet2: IPet): boolean {
    return (pet1.petSex !== pet2.petSex) && (pet1.petSpecies === pet2.petSpecies)
}