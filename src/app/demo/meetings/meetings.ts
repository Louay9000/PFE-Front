import { Component, OnInit } from '@angular/core';
import { Meeting } from '../models/Meeting';
import { MeetingService } from '../services/meeting-service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonModule } from '@angular/common';
import { Emailservice } from '../services/emailservice';
import { User } from '../models/User';
import { DepartmentService } from '../services/department-service';
import { Auth } from '../services/auth';
import { Platform } from '../models/platform'; // Import the platform enum

@Component({
  selector: 'app-meetings',
  imports: [CommonModule, SharedModule],
  templateUrl: './meetings.html',
  styleUrl: './meetings.scss'
})
export class Meetings implements OnInit {
meetings: Meeting[] = [];
  newMeeting: Partial<Meeting> = { platform: Platform.GOOGLE_MEET };
  depId: number;

  constructor(
    private auth: Auth,
    private meetingService: MeetingService,
    private emailService: Emailservice,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.auth.loadProfile();
    this.meetingService.getMeetings().subscribe({
      next: data => (this.meetings = data),
      error: err => console.error('Failed to load meetings', err)
    });
  }

  createMeeting() {
    if (!this.newMeeting.title || !this.newMeeting.startTime || !this.newMeeting.endTime) {
      alert('Please fill all required fields');
      return;
    }

    // Générer le lien Google Meet ou Teams
    this.newMeeting.link =
      this.newMeeting.platform === Platform.GOOGLE_MEET
        ? 'https://meet.google.com/new'
        : 'https://teams.microsoft.com/l/meetup-join/' +
          Math.random().toString(36).substring(2, 10);

    // 1️⃣ D'abord récupérer le département du manager connecté
    this.departmentService.GetDepartmentIdByUserId(this.auth.userId).subscribe({
      next: (deptId: number) => {
        // 2️⃣ Sauvegarder la réunion
        this.meetingService.addMeeting(this.newMeeting as Meeting).subscribe({
          next: savedMeeting => {
            this.meetings.push(savedMeeting);

            // 3️⃣ Récupérer tous les employés de ce département
            this.departmentService.GetEmployeesByDepartment({ id: deptId } as any).subscribe({
              next: (users: User[]) => {
                users.forEach(user => {
                  const subject = `Invitation to meeting: ${savedMeeting.title}`;
                  const text = `Hi ${user.username},\n\nYou are invited to a meeting.\n\nTitle: ${savedMeeting.title}\nPlatform: ${savedMeeting.platform}\nLink: ${savedMeeting.link}\nStart: ${savedMeeting.startTime}\nEnd: ${savedMeeting.endTime}\n\nBest regards.`;

                  this.emailService.sendEmail(user.email, subject, text).subscribe({
                    next: () => console.log(`Email sent to ${user.email}`),
                    error: err => console.error(`Failed to send email to ${user.email}`, err)
                  });
                });
              },
              error: err => console.error('Failed to get employees for department', err)
            });

            // 4️⃣ Réinitialiser le formulaire après création
            this.newMeeting = {
              title: '',
              description: '',
              platform: Platform.GOOGLE_MEET,
              startTime: null,
              endTime: null,
              link: ''
            };
          },
          error: err => console.error('Failed to create meeting', err)
        });
      },
      error: err => console.error('Failed to get departmentId by userId', err)
    });
  }

  DeleteMeeting(meetingId: number) {
    this.meetingService.deleteMeeting(meetingId).subscribe({
      next: () => {
        this.meetings = this.meetings.filter(meeting => meeting.id !== meetingId);
      },
      error: err => console.error('Failed to delete meeting', err)
    });
  }
  
}
