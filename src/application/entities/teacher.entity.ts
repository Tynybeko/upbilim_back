import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../options/base-entity.options';
import { RegionEntity } from '../../region/entities/region.entity';
import { CountryEntity } from 'src/country/entities/country.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { SchoolEntity } from 'src/school/entities/school.entity';

@Entity('application_teacher')
export class TeachApplicationEntity extends BaseEntity {
    @Column({})
    document: string

    @Column({ nullable: true })
    content: string

    
    @Column({ nullable: true })
    contact: string

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => SchoolEntity)
    @JoinColumn({ name: 'school_id' })
    school: SchoolEntity;


    @Column({
        default: 'pending',
    })
    status: string

}
