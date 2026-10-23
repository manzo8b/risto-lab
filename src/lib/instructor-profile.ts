export interface InstructorProfile{id:string;firstName:string;displayName:string;initials:string;roleLabel:string;avatarUrl?:string}
export interface InstructorProvider{getCurrentInstructor():InstructorProfile|null}
export class LocalInstructorProvider implements InstructorProvider{constructor(private profile:InstructorProfile|null={id:'instructor-local',firstName:'Marcelo',displayName:'Marcelo Fernandez',initials:'MF',roleLabel:'Docente'}){}getCurrentInstructor(){return this.profile;}}
export const currentInstructor=new LocalInstructorProvider().getCurrentInstructor();
export function instructorGreeting(profile:InstructorProfile|null){return profile?.firstName.trim()?'Buongiorno, '+profile.firstName.trim():'Buongiorno';}
