import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, takeLast, first } from 'rxjs/operators';
import { Course } from '../model/course';
import { Observable, from } from 'rxjs';
import { convertSnaps } from './db-utils';
import { Lesson } from '../model/lesson';
import { OrderByDirection } from '@firebase/firestore-types';

@Injectable({
  providedIn: 'root'
})

export class CoursesService implements OnInit {

  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
  }

  saveCourse(courseId:string, changes: Partial<Course>): Observable<any> {
    // zwraca promise wiec zmieniamy w observable
    return from (this.db.doc(`courses/${courseId}`).update(changes));
  }

  loadAllCourses(): Observable<Course[]> {
    return this.db.collection('courses', ref => ref.orderBy('seqNo')).snapshotChanges()
      .pipe(map(snaps => convertSnaps<Course>(snaps)), first());
  }

  findCourseByUrl(courseUrl: string):Observable<Course> {
    console.log(courseUrl);
    return this.db.collection('courses', 
      ref => ref.where('url', '==', courseUrl))
      .snapshotChanges()
      .pipe(
        map(snaps => {
          const courses = convertSnaps<Course>(snaps);
          return courses.length == 1 ? courses[0]: undefined;
        }),
        first()
      )
  }

  findLessons(courseId: string, sortOrder: OrderByDirection = 'asc', pageNumber = 0, pageSize = 3): Observable<Lesson[]> {
    return this.db.collection(`courses/${courseId}/lessons`, 
      ref => ref.orderBy('seqNo', sortOrder)
        .limit(pageSize)
        .startAfter(pageNumber * pageSize))
      .snapshotChanges()
      .pipe(
        map(snaps => convertSnaps<Lesson>(snaps)),
        first(),
      )
  }
}
