import { IsOptional, IsObject, IsEmail } from 'class-validator';
import {
  OptionalString,
  OptionalInt,
  OptionalEnum,
  OptionalStringArray,
} from '../../../common/decorators/validation.decorators';
import {
  LIKERT_WITH_NA_VALUES,
  CONFERENCE_LENGTH_VALUES,
  IMPROVEMENTS_VALUES,
  EMPLOYMENT_STATUS_VALUES,
} from '../constants/validation.constants';

export class CreateSurveyResponseDto {
  // Email for confirmation (optional)
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  // Q1: Overall conference rating (Likert 1-5)
  @OptionalInt(1, 5)
  q1OverallRating?: number;

  @OptionalString()
  q1Comment?: string;

  // Q2: Return attendance intent (Likert 1-5)
  @OptionalInt(1, 5)
  q2ReturnIntent?: number;

  @OptionalString()
  q2Comment?: string;

  // Q3: Coworking day effectiveness (Likert with N/A)
  @OptionalEnum(LIKERT_WITH_NA_VALUES, 'q3CoworkingEffectiveness')
  q3CoworkingEffectiveness?: string;

  @OptionalString()
  q3Comment?: string;

  // Q4: Connection types (multiple select)
  @OptionalStringArray()
  q4ConnectionTypes?: string[];

  @OptionalString()
  q4ConnectionOther?: string;

  @OptionalString()
  q4Comment?: string;

  // Q5: Connection depth (Likert 1-5)
  @OptionalInt(1, 5)
  q5ConnectionDepth?: number;

  @OptionalString()
  q5Comment?: string;

  // Q6: Learning value (Likert 1-5)
  @OptionalInt(1, 5)
  q6LearningValue?: number;

  @OptionalString()
  q6Comment?: string;

  // Q7: Future learning topics (open-ended)
  @OptionalString()
  q7FutureTopics?: string;

  // Q8: Saturday personal time worth (Likert with N/A)
  @OptionalEnum(LIKERT_WITH_NA_VALUES, 'q8SaturdayWorth')
  q8SaturdayWorth?: string;

  @OptionalString()
  q8Comment?: string;

  // Q9: Pre-conference communication (Likert 1-5)
  @OptionalInt(1, 5)
  q9PreConferenceCommunication?: number;

  @OptionalString()
  q9Comment?: string;

  // Q10: Accommodations, venue & catering (Likert with N/A)
  @OptionalEnum(LIKERT_WITH_NA_VALUES, 'q10AccommodationsVenue')
  q10AccommodationsVenue?: string;

  @OptionalString()
  q10Comment?: string;

  // Q11: Session format rankings (JSON object)
  @IsOptional()
  @IsObject()
  q11SessionRankings?: Record<string, number>;

  // Q12: Conference length (single choice)
  @OptionalEnum(CONFERENCE_LENGTH_VALUES, 'q12ConferenceLength')
  q12ConferenceLength?: string;

  @OptionalString()
  q12Comment?: string;

  // Q13: Comparison to other PD (Likert with N/A)
  @OptionalEnum(LIKERT_WITH_NA_VALUES, 'q13ComparisonToPD')
  q13ComparisonToPD?: string;

  @OptionalString()
  q13Comment?: string;

  // Q14: What you liked most (open-ended)
  @OptionalString()
  q14LikedMost?: string;

  // Q15: Additional feedback (open-ended)
  @OptionalString()
  q15AdditionalFeedback?: string;

  // Q16: Improvements from last year (single choice with comment)
  @OptionalEnum(IMPROVEMENTS_VALUES, 'q16Improvements')
  q16Improvements?: string;

  @OptionalString()
  q16Comment?: string;

  // Q17: Feedback confidence (multiple select)
  @OptionalStringArray()
  q17FeedbackConfidence?: string[];

  @OptionalString()
  q17FeedbackOther?: string;

  // Q18: Employment status (single choice)
  @OptionalEnum(EMPLOYMENT_STATUS_VALUES, 'q18EmploymentStatus')
  q18EmploymentStatus?: string;

  // Q19: Name and location (demographics)
  @OptionalString()
  q19Name?: string;

  @OptionalString()
  q19Location?: string;
}
